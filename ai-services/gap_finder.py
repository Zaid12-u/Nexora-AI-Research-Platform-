import os
from groq import Groq
from openalex_fetch import fetch_from_openalex
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def find_research_gaps(query: str):
    try:
        
        papers = fetch_from_openalex(query, max_results=10)

        if not papers:
            return {"analysis": "No papers found for this topic.", "papers_analyzed": 0, "papers": []}

        
        papers_context = ""
        for i, paper in enumerate(papers):
            papers_context += f"Paper {i+1}: {paper['title']}\n{paper['abstract']}\n\n"

        prompt = f"""You are an expert research analyst. Analyze these research papers on "{query}" and identify:

1. What has already been done (existing work)
2. What is missing or underexplored (research gaps)
3. Future research directions

Papers:
{papers_context}

Provide a structured analysis with:
- **Existing Work:** (what researchers have done)
- **Research Gaps:** (what is missing)
- **Future Directions:** (what can be done next)

Be specific and concise."""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "user", "content": prompt}
            ],
            max_tokens=800,
            temperature=0.7
        )

        return {
            "analysis": response.choices[0].message.content,
            "papers_analyzed": len(papers),
            "papers": papers
        }

    except Exception as e:
        return {"analysis": f"Error: {str(e)}", "papers_analyzed": 0, "papers": []}