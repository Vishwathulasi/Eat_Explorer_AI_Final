Eat Explorer

A food discovery assistant that intelligently recommends restaurants based on user preferences. This project combines natural language processing, rule‑based scoring, and offline review analysis to generate context‑aware recommendations.

Features
Natural language understanding using Gemini‑based NLP extraction

Attribute detection including cuisine, dish, mood, budget, distance, and preferences

Multi‑stage scoring pipeline for restaurant relevance and ranking

Review‑boosting module for improved ranking using customer feedback

Clear and conversational explanation of recommendations

“Surprise Me” mode for random intelligent suggestions

Works fully offline with a custom curated dataset of local restaurants

System Architecture
NLP Module
Interprets user queries in natural language

Extracts structured attributes such as cuisine, dish, dietary preferences, mood, and budget

Infers cuisine from dish (e.g., dosa → South Indian)

Handles fallback logic when the dish or cuisine is not explicitly available

Detects veg‑only preferences and constraints

Scoring and Ranking Module
Scores restaurants based on how well they match the extracted attributes

Incorporates distance, cuisine relevance, dish relevance, budget fit, and popularity

Applies weighted scoring to ensure balanced recommendations

Performs rule‑based filtering where needed

Produces a ranked list from best match to lowest match

Review Boost Module
Analyzes customer reviews to improve ranking accuracy

Computes a relevance score between user intent and review content

Highlights short, meaningful review summaries

Rewards restaurants with strong positive sentiment

Ensures explanations include context from real customer experiences

Response Formatter Module
Converts backend results into clear, human‑friendly explanations

Generates global reasoning based on user preferences

Outputs only reasoning text (without leaking restaurant details as required)

Provides structured message formatting for frontend display

Ensures consistency across all recommendation types

Dataset
Custom curated dataset collected from multiple sources

Includes restaurant name, cuisine, cost, location, reviews, popularity, and food style

Converted into a unified JSON format for efficient offline use

Installation
git clone https://github.com/Vishwathulasi/Eat_Explorer.git
cd Eat_Explorer
Backend and frontend installation steps can be added here depending on your structure.

Usage
Run the backend server to enable NLP processing and recommendation generation

Use the frontend interface to input queries such as:

“I want something spicy and cheap”

“Suggest good comfort food nearby”

“Show me cheesy dishes under 150 rupees”

The system returns ranked recommendations with clear reasoning

Project Structure:

├── Backend  
│   ├── app  
│   │   ├── services  
│   │   ├── data  
│   │   ├── routes  
│   │   └── models  
│   └── main.py  
│
├── Frontend  
│   ├── src  
│   └── public  
│
└── README.md