# 🥗 Nutrition Recommendation System

A **full-stack AI application** that recommends foods based on nutrient similarity and user dietary goals.  
Built using **React**, **FastAPI**, and **Python (Content-Based ML Model)** powered by the **USDA FoodData Central Foundation Foods 2025** dataset.

---

## 🚀 Overview

The Nutrition Recommendation System helps users discover foods aligned with their health objectives — such as high-protein or low-calorie diets.  
Using nutrient composition data, it identifies similar food items and delivers personalized recommendations through an interactive web interface.

---

## 🧠 Core Features

- 🍎 **Personalized Recommendations** — Suggests foods based on nutrient similarity.  
- ⚙️ **Content-Based Filtering** — Uses nutrient profiles (protein, carbs, fat, etc.) for similarity scoring.  
- 💻 **Full-Stack Architecture** — React frontend + FastAPI backend + ML model integration.  
- 📊 **Data-Driven Insights** — Built on USDA FoodData Central Foundation Foods 2025 dataset.  
- 🌐 **Scalable Design** — Modular backend with REST APIs for easy extension.

---

## 🧩 Tech Stack

**Frontend:** React, Tailwind CSS  
**Backend:** FastAPI, Python  
**Machine Learning:** Scikit-learn, NumPy, Pandas  
**Dataset:** [USDA FoodData Central Foundation Foods 2025](https://www.kaggle.com/datasets/barkataliarbab/usda-fooddata-central-foundation-foods-2025)  
**Deployment (optional):** Render / AWS / Vercel

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/VarunHarinath/Intelligent-Nutrition-Recommendation-System
cd intelligent-nutrition-recommendation-system
```


### 2️⃣ Backend Setup (FastAPI)
```bash
cd server
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3️⃣ Frontend Setup (React)
```bash
cd client
npm install
npm start
```



