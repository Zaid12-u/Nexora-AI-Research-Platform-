from openalex_fetch import fetch_from_openalex
from database import get_papers_collection
from sentence_transformers import SentenceTransformer
import time
import os

os.environ["TRANSFORMERS_OFFLINE"] = "1"
os.environ["HF_DATASETS_OFFLINE"] = "1"

model = SentenceTransformer('all-MiniLM-L6-v2', local_files_only=True)

topics = [
    # AI & Machine Learning
    "machine learning", "deep learning", "neural networks", "natural language processing",
    "computer vision", "reinforcement learning", "transfer learning", "federated learning",
    "generative adversarial networks", "transformer models", "BERT language model",
    "GPT language model", "attention mechanism", "convolutional neural networks",
    "recurrent neural networks", "graph neural networks", "explainable AI",
    "AI ethics", "AI fairness", "AutoML",

    # Data Science
    "data mining", "big data", "data preprocessing", "feature engineering",
    "dimensionality reduction", "clustering algorithms", "classification algorithms",
    "regression analysis", "ensemble methods", "random forest",
    "support vector machines", "k-nearest neighbors", "naive bayes",
    "gradient boosting", "XGBoost", "data visualization", "statistical learning",
    "anomaly detection", "time series analysis", "data augmentation",

    # Healthcare & Medicine
    "medical image analysis", "disease prediction", "cancer detection",
    "diabetes prediction", "heart disease prediction", "drug discovery",
    "genomics machine learning", "clinical NLP", "medical diagnosis AI",
    "COVID-19 machine learning", "mental health AI", "radiology AI",
    "electronic health records", "precision medicine", "biomedical NLP",
    "protein structure prediction", "brain tumor detection", "retinal disease detection",
    "pneumonia detection", "skin cancer detection",

    # Robotics & Automation
    "autonomous vehicles", "robot learning", "motion planning",
    "object detection", "semantic segmentation", "SLAM robotics",
    "drone navigation", "robotic arm control", "human robot interaction",
    "industrial automation", "self driving cars", "path planning",
    "robot perception", "manipulation learning", "multi robot systems",

    # Security & Privacy
    "cybersecurity machine learning", "intrusion detection",
    "malware detection", "network security AI", "fraud detection",
    "privacy preserving machine learning", "differential privacy",
    "adversarial attacks", "deepfake detection", "biometric authentication",
    "anomaly detection security", "phishing detection", "spam detection",
    "face recognition", "voice authentication",

    # Natural Language Processing
    "sentiment analysis", "text classification", "named entity recognition",
    "machine translation", "question answering", "text summarization",
    "information extraction", "dialogue systems", "speech recognition",
    "language generation", "coreference resolution", "semantic parsing",
    "word embeddings", "topic modeling", "text mining",

    # Computer Vision
    "image classification", "object recognition", "image segmentation",
    "face detection", "pose estimation", "optical flow",
    "image generation", "video understanding", "scene recognition",
    "depth estimation", "image super resolution", "image captioning",
    "visual question answering", "document understanding", "OCR deep learning",

    # Education & E-Learning
    "educational data mining", "intelligent tutoring systems",
    "student performance prediction", "learning analytics",
    "adaptive learning", "MOOCs analysis", "knowledge tracing",
    "automated essay scoring", "plagiarism detection", "e-learning recommendation",

    # Finance & Economics
    "stock market prediction", "algorithmic trading", "credit scoring",
    "risk assessment machine learning", "financial fraud detection",
    "cryptocurrency prediction", "portfolio optimization",
    "insurance risk prediction", "loan default prediction", "market analysis AI",

    # Environment & Climate
    "climate change prediction", "weather forecasting machine learning",
    "renewable energy prediction", "air quality prediction",
    "wildfire detection", "flood prediction", "earthquake prediction",
    "satellite image analysis", "biodiversity AI", "carbon emission prediction",

    # Recommendation Systems
    "collaborative filtering", "content based filtering",
    "hybrid recommendation systems", "matrix factorization",
    "deep learning recommendation", "session based recommendation",
    "knowledge graph recommendation", "multi armed bandit recommendation",

    # Social Media & Web
    "social network analysis", "fake news detection", "hate speech detection",
    "misinformation detection", "social media sentiment", "viral content prediction",
    "user behavior analysis", "click through rate prediction",
    "web scraping NLP", "community detection",

    # Optimization & Theory
    "evolutionary algorithms", "genetic algorithms", "swarm intelligence",
    "bayesian optimization", "multi objective optimization",
    "neural architecture search", "hyperparameter optimization",
    "meta learning", "few shot learning", "zero shot learning",

    # Physics & Science
    "physics informed neural networks", "quantum machine learning",
    "materials science AI", "drug target interaction",
    "molecular dynamics machine learning", "particle physics AI",
    "astronomy machine learning", "chemistry AI", "computational biology",
    "bioinformatics deep learning",

    # Industry & Applications
    "predictive maintenance", "quality control machine learning",
    "supply chain optimization", "demand forecasting",
    "smart grid machine learning", "agriculture AI", "food quality detection",
    "construction AI", "retail analytics", "customer churn prediction",

    # Emerging Topics
    "large language models", "diffusion models", "vision transformers",
    "multimodal learning", "contrastive learning", "self supervised learning",
    "prompt engineering", "chain of thought reasoning", "retrieval augmented generation",
    "mixture of experts", "knowledge distillation", "model compression",
    "edge AI", "neuromorphic computing", "quantum neural networks",

    # Miscellaneous
    "sports analytics", "music generation AI", "art generation AI",
    "legal NLP", "patent analysis", "citation network analysis",
    "bibliometric analysis", "peer review automation", "research trend analysis",
    "scientific paper classification"
]

def get_embedding(text: str):
    return model.encode([text])[0].tolist()

def seed_database():
    collection = get_papers_collection()
    total_topics = len(topics)
    total_saved = 0
    failed_topics = []

    print(f"\n Seeding database with {total_topics} topics...\n")

    for i, topic in enumerate(topics):
        print(f"[{i+1}/{total_topics}] Fetching: {topic}")

        try:
            
            existing = collection.count_documents({"topic": topic.lower().strip()})
            if existing >= 5:
                print(f"   Already exists ({existing} papers) — skipping!")
                continue

            
            papers = fetch_from_openalex(topic, max_results=10)

            if not papers:
                print(f"  ⚠️ No papers found for: {topic}")
                failed_topics.append(topic)
                time.sleep(2)
                continue

            
            saved = 0
            for paper in papers:
                try:
                    text = f"{paper['title']} {paper['abstract']}"
                    embedding = get_embedding(text)
                    paper['embedding'] = embedding
                    paper['topic'] = topic.lower().strip()

                    collection.update_one(
                        {"title": paper["title"]},
                        {"$set": paper},
                        upsert=True
                    )
                    saved += 1
                except Exception as e:
                    print(f"   Save error: {e}")

            total_saved += saved
            print(f"   Saved {saved} papers! Total: {total_saved}")

        
            time.sleep(1)

        except Exception as e:
            print(f"  ❌ Error: {e}")
            failed_topics.append(topic)
            time.sleep(3)

    print(f"\n Done! Total papers saved: {total_saved}")
    print(f" Failed topics: {len(failed_topics)}")
    if failed_topics:
        print("Failed:", failed_topics)

if __name__ == "__main__":
    seed_database()