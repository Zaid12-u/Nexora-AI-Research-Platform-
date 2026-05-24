from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from search import search_papers, deep_search
from qa import answer_question
from gap_finder import find_research_gaps
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchRequest(BaseModel):
    query: str
    max_results: int = 10

class DeepSearchRequest(BaseModel):
    query: str

class QARequest(BaseModel):
    question: str
    paper_title: str
    paper_abstract: str

class GapRequest(BaseModel):
    query: str

@app.get("/")
def root():
    return {"message": "AI Service Ready!"}

@app.post("/search")
def search(request: SearchRequest):
    results = search_papers(request.query, request.max_results)
    return {"results": results}

@app.post("/deep-search")
def deep_search_route(request: DeepSearchRequest):
    result = deep_search(request.query)
    return result

@app.post("/qa")
def qa(request: QARequest):
    answer = answer_question(request.question, request.paper_title, request.paper_abstract)
    return {"answer": answer}

@app.post("/gap-finder")
def gap_finder(request: GapRequest):
    gaps = find_research_gaps(request.query)
    return gaps