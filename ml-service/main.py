from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib

from initialize_state import initialize_state
from predict_next_day import predict_next_day
from forecast_category import forecast_category

app = FastAPI()


# categories
categories = ["M01AB","M01AE","N02BA","N02BE","N05B","N05C","R03","R06"]


# load dataset (used only for average initialization)
data = pd.read_csv("salesdaily.csv")


# compute averages
avg_sales = data[categories].mean()


# initialize lag state
state = initialize_state(categories, avg_sales)


# load models
models = {}
for cat in categories:
    models[cat] = joblib.load(f"model_{cat}.pkl")


# request schemas
class CategoryRequest(BaseModel):
    category: str


class ForecastRequest(BaseModel):
    category: str
    days: int = 30


# endpoint: predict tomorrow demand
@app.post("/predict-next-day")
def predict_next(req: CategoryRequest):

    category = req.category

    if category not in categories:
        return {"error": "Invalid category"}

    prediction = predict_next_day(category, models, state)

    return {
        "category": category,
        "predicted_demand": float(prediction)
    }


# endpoint: multi-day forecast
@app.post("/forecast")
def forecast(req: ForecastRequest):

    category = req.category
    days = req.days

    if category not in categories:
        return {"error": "Invalid category"}

    predictions = forecast_category(category, days, models, state)

    restock_quantity = sum(p["predicted_sales"] for p in predictions)

    return {
        "category": category,
        "days": days,
        "daily_forecast": predictions,
        "restock_quantity": restock_quantity
    }