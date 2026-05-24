import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def answer_question(question: str, paper_title: str, paper_abstract: str):
    try:
        prompt = f"""You are a research assistant helping users understand academic papers.

Paper Title: {paper_title}
Paper Abstract: {paper_abstract}

User Question: {question}

Answer the question based on the paper information provided. Be clear, concise and helpful.
If the answer cannot be found in the abstract, say so honestly and provide general knowledge."""

        response = client.chat.completions.create(
           model="llama-3.3-70b-versatile", 
            messages=[
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.7
        )

        return response.choices[0].message.content

    except Exception as e:
        return f"Error: {str(e)}"