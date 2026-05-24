from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
from openalex_fetch import fetch_from_openalex
from database import get_papers_collection

model = SentenceTransformer('all-MiniLM-L6-v2')

def get_embedding(text: str):
    return model.encode([text])[0].tolist()

def search_papers(query: str, max_results: int = 10):
    collection = get_papers_collection()
    
    query_embedding = np.array(model.encode([query]))

    all_papers = list(collection.find({}, {"_id": 0}))

    if len(all_papers) > 0:
        embeddings = []
        valid_papers = []

        for paper in all_papers:
            if paper.get("embedding"):
                embeddings.append(paper["embedding"])
                valid_papers.append(paper)

        if embeddings:
            paper_embeddings = np.array(embeddings).astype('float32')
            query_emb = query_embedding.astype('float32')

            dimension = paper_embeddings.shape[1]
            index = faiss.IndexFlatL2(dimension)
            index.add(paper_embeddings)

            k = min(max_results, len(valid_papers))
            distances, indices = index.search(query_emb, k)

            threshold = 1.5
            similar_papers = []
            for i, dist in zip(indices[0], distances[0]):
                if dist < threshold:
                    similar_papers.append(valid_papers[i])

            if similar_papers:
                print(f"MongoDB se {len(similar_papers)} papers mile!")
                return similar_papers

    print(f"OpenAlex se fetch ho raha hai: {query}")
    papers = fetch_from_openalex(query, max_results=10)

    if not papers:
        return []

    for paper in papers:
        text = f"{paper['title']} {paper['abstract']}"
        embedding = get_embedding(text)
        paper['embedding'] = embedding
        paper['topic'] = query.lower().strip()

        try:
            collection.update_one(
                {"title": paper["title"]},
                {"$set": paper},
                upsert=True
            )
        except Exception as e:
            print(f"Save error: {e}")

    return papers


def deep_search(query: str):
    papers = search_papers(query, max_results=5)

    if not papers:
        return {"summary": "No papers found.", "papers": []}

    summary_lines = []
    for i, paper in enumerate(papers):
        sentences = paper['abstract'].split('. ')
        top_sentence = sentences[0] if sentences else ""
        summary_lines.append(f"• {paper['title']}: {top_sentence}.")

    summary = f"Based on top {len(papers)} papers about '{query}':\n\n" + "\n".join(summary_lines)

    return {
        "summary": summary,
        "papers": papers
    }