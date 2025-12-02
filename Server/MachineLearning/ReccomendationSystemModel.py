import os
import cloudpickle
import pandas as pd
import numpy as np

class ReccomendationSystem:
    def __init__(self, model_path="nutrition_recommendation_ensemble_v2.pkl"):
        """
        Loads the saved ensemble recommendation model using cloudpickle.
        """
        base_path = os.path.dirname(os.path.abspath(__file__))
        self.model_path = os.path.join(base_path, model_path)
        self._load_model()

    def _load_model(self):
        """
        Load the model object saved via cloudpickle.
        """
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Model file not found at {self.model_path}")
        
        with open(self.model_path, "rb") as f:
            self.model_data = cloudpickle.load(f)

        self.food_matrix = self.model_data["food_matrix"]
        self.nutrient_map = self.model_data["nutrient_map"]
        self.scaler_standard = self.model_data["scaler_standard"]
        self.scaler_minmax = self.model_data["scaler_minmax"]
        self.kmeans_1 = self.model_data["kmeans_1"]
        self.kmeans_2 = self.model_data["kmeans_2"]
        self.kmeans_3 = self.model_data["kmeans_3"]
        self.kmeans_4 = self.model_data["kmeans_4"]
        self.kmeans_5 = self.model_data["kmeans_5"]
        # Ensure recommend_ensemble is included in the saved model
        self.recommend_ensemble = self.model_data.get("recommend_ensemble", self._default_recommend_ensemble)

    def recommend(self, nutrient_requirements, top_n=15):
        """
        Run the ensemble recommendation using the nutrient requirements.
        """
        if not self.recommend_ensemble:
            raise ValueError("Recommendation function not available in the model.")
        
        return self.recommend_ensemble(
            nutrient_requirements,  # pass the dict directly
            top_n=top_n,
            food_matrix=self.food_matrix,
            nutrient_map=self.nutrient_map
        )

    @staticmethod
    def _default_recommend_ensemble(goal_dict, top_n=15, food_matrix=None, nutrient_map=None):
        """
        Fallback ensemble function if recommend_ensemble is not in the saved model.
        """
        if food_matrix is None or nutrient_map is None:
            raise ValueError("Food matrix and nutrient map must be provided.")
        
        df = food_matrix.copy()
        scores = pd.Series(0, index=df.index, dtype=float)

        for nutrient, goal in goal_dict.items():
            col = nutrient_map.get(nutrient)
            if col not in df.columns:
                print(f"⚠️ Nutrient {nutrient} not found")
                continue
            values = df[col]
            norm = (values - values.min()) / (values.max() - values.min() + 1e-9)
            if goal.lower() == "high":
                scores += norm
            elif goal.lower() == "low":
                scores += (1 - norm)
            elif goal.lower() == "medium":
                scores += 1 - np.abs(norm - 0.5) * 2

        # Add cluster weights
        cluster_weights = [0.02, 0.015, 0.01, 0.008, 0.005]
        for i, weight in enumerate(cluster_weights, start=1):
            cluster_col = f"cluster_{i}"
            if cluster_col in df.columns:
                scores += df[cluster_col] * weight

        df["score"] = scores
        df = df.sort_values("score", ascending=False)
        return df[["description", "score"]].head(top_n)