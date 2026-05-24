from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")


client = None
db = None
papers_collection = None

def get_papers_collection():
    global client, db, papers_collection
    if papers_collection is None:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        db = client["researchai"]
        papers_collection = db["papers"]
        papers_collection.create_index("topic")
        papers_collection.create_index("title")
    return papers_collection