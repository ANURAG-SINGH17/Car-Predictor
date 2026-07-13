from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import pandas as pd
import json
import os

app = FastAPI(title="Car Price Prediction API - Linear Regression")

# Configure CORS for strict validation communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "car_price_lr_Model.pkl")
JSON_PATH = os.path.join(BASE_DIR, "frontend_dropdown_data.json")

if not os.path.exists(MODEL_PATH) or not os.path.exists(JSON_PATH):
    raise FileNotFoundError("Required Linear Regression project assets (.pkl) are missing.")

# Secure standard scikit-learn un-pickling
with open(MODEL_PATH, "rb") as f:
    model_pipeline = pickle.load(f)

with open(JSON_PATH, "r") as f:
    dropdown_options = json.load(f)

class CarPredictionInput(BaseModel):
    Car_Name: str
    Present_Price: float
    Kms_Driven: int
    Fuel_Type: str
    Seller_Type: str
    Transmission: str
    Owner: int
    Car_Age: int

@app.get("/")
def home():
    return {"message": "Linear Regression API is operational!"}

# === MISSING ROUTE ADDED HERE ===
@app.get("/dropdown-options")
def get_dropdown_options():
    return dropdown_options

@app.post("/predict")
def predict_car_price(data: CarPredictionInput):
    try:
        # Build direct structural Pandas data row
        input_df = pd.DataFrame([{
            'Car_Name': data.Car_Name,
            'Present_Price': data.Present_Price,
            'Kms_Driven': data.Kms_Driven,
            'Fuel_Type': data.Fuel_Type,
            'Seller_Type': data.Seller_Type,
            'Transmission': data.Transmission,
            'Owner': data.Owner,
            'Car_Age': data.Car_Age
        }])

        # Trigger internal OneHot and Scaling transformations through pipeline
        prediction = model_pipeline.predict(input_df)[0]
        raw_val = float(prediction)
        
        # Hard floor check to avoid rare negative intercept math drops
        final_price_lakhs = max(0.0, raw_val)

        return {
            "status": "success",
            "raw_model_output": raw_val,
            "predicted_price_lakhs": round(final_price_lakhs, 2),
            "predicted_price_rupees": round(final_price_lakhs * 100000, 2)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Linear Regression Engine Error: {str(e)}")