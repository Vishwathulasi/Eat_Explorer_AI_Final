# 🍽️ Eat Explorer
### Intelligent Food Recommendation System

---
**Table of Contents**
* [Project Overview](#-project-overview)
* [NLP and Recommendation Strategy](#-nlp--recommendation-strategy)
* [Tech Stack](#%EF%B8%8F-tech-stack)
* [Setup and Installation](#-setup--installation)

---


## 📘 Project Overview

**Eat Explorer** is an AI-powered food discovery assistant that recommends the best restaurants based on natural, conversational user queries.

It understands phrases like:

> *“something spicy under 200 near me”*

and converts them into structured attributes using NLP. These attributes pass through a **multi-stage scoring pipeline** and a **review-enhanced reranking system** to generate accurate, meaningful, and human-friendly recommendations.

The system operates **fully offline** using a curated dataset and includes:

- NLP parsing  
- Scoring logic  
- Review intelligence  
- Conversational response generation  

---

## 🔍 NLP & Recommendation Strategy

Eat Explorer uses a **hybrid intelligence pipeline** combining NLP, scoring, and review-based reranking.
![User Request](https://github.com/user-attachments/assets/332621b0-7daa-47ab-9f38-07a2c711c4a6)

---

## 🧠 1. NLP Attribute Extraction

Gemini NLP extracts structured attributes from user queries:

- Cuisine  
- Dish  
- Mood  
- Budget  
- Distance  
- Food style  
- Additional constraints  

This converts free-form text into **machine-processable attributes**.

---

## 📊 2. Scoring Pipeline

Each restaurant receives a **baseline score** based on:

- Cuisine match  
- Dish relevance  
- Budget compatibility  
- Distance proximity  
- Popularity score  
- Food style alignment  

This determines the **initial ranking**.

---

## 📝 3. Review Intelligence Module

Enhances ranking quality using **offline review analysis**:

- Semantic similarity between query & reviews  
- Token overlap scoring   
- Short highlight extraction  

Restaurants with strong **review alignment** receive a ranking boost.

---

## 🏆 4. Final Reranking

The system blends:

- Base score  
- Review-match score  

**Result:** context-aware, user-aligned restaurant recommendations.

---

## 📈 Analysis & Output Features

The system provides:

- Global reasoning explaining recommendation logic  
- Clean, conversational responses (no internal data leakage)  
- Structured restaurant list (`recommendations[]`)  
- Positive review highlights  
- **Surprise-Me Mode** for intelligent random suggestions  

---

## 🛠️ Tech Stack

### Backend
- Flask  
- Gemini API (NLP extraction)  
- Custom Scoring Engine  
- Review Boost Engine  
- Pandas (CSV processing)    

### Frontend
- React  
- React Router  
- Axios  
- Vite  

---

## 📦 Setup & Installation

### Prerequisites
- Python 3.9+  
- Node.js 16+  
- Gemini API Key  

---

## 💾 Clone the Repository

```bash
🔙 Backend Setup
Create Virtual Environment
python -m venv venv

Activate Environment

Windows

venv\Scripts\activate


Mac / Linux

source venv/bin/activate

Install Dependencies
pip install -r requirements.txt

Environment Variables

Create a .env file:

GEMINI_API_KEY=your_api_key_here

Start Backend
python -m app.main


Backend URL:

http://localhost:8000

🖥️ Frontend Setup
Go to Frontend
cd frontend

Install Packages
npm install

Start Frontend
npm run dev


Frontend URL:

http://localhost:5173

🚀 How to Use Eat Explorer
1. Enter Your Query

Examples:

spicy biryani under 200 near me

light cheesy food for dinner

comfort food after a long day

NLP extracts all attributes automatically.

2. Receive Recommendations

You get:

Ranked restaurant list

Reasoning message

Positive review highlights

Full metadata inside recommendations[]

3. Surprise Me Mode

Generates an intelligent random suggestion based on:

Popularity

Review positivity

Cuisine variety
git clone https://github.com/Vishwathulasi/Eat_Explorer_AI.git
cd Eat_Explorer_AI
