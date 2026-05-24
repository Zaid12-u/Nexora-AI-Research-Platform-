import requests

def fetch_from_openalex(query: str, max_results: int = 10):
    try:
        url = "https://api.openalex.org/works"
        params = {
            "search": query,
            "per-page": max_results,
            "filter": "is_oa:true",
            "sort": "relevance_score:desc",
            "select": "title,abstract_inverted_index,authorships,publication_date,doi,id"
        }

        headers = {
            "User-Agent": "ResearchAI/1.0 (mailto:your@email.com)"
        }

        res = requests.get(url, params=params, headers=headers)
        data = res.json()

        papers = []
        for work in data.get("results", []):
            
            abstract = reconstruct_abstract(work.get("abstract_inverted_index", {}))
            
            if not abstract or not work.get("title"):
                continue

        
            authors = []
            for author in work.get("authorships", [])[:3]:
                name = author.get("author", {}).get("display_name", "")
                if name:
                    authors.append(name)

            
            doi = work.get("doi", "")
            url_link = doi if doi else work.get("id", "")

            papers.append({
                "title": work.get("title", "Unknown"),
                "abstract": abstract,
                "authors": authors,
                "url": url_link,
                "published": work.get("publication_date", "N/A")
            })

        return papers

    except Exception as e:
        print(f"OpenAlex error: {e}")
        return []


def reconstruct_abstract(inverted_index: dict) -> str:
    if not inverted_index:
        return ""
    try:
        
        words = {}
        for word, positions in inverted_index.items():
            for pos in positions:
                words[pos] = word
        
        
        sorted_words = [words[i] for i in sorted(words.keys())]
        return " ".join(sorted_words)
    except:
        return ""