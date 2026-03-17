import pandas as pd
from datetime import datetime, timedelta

def predict_next_day(category, models, state):

    model = models[category]
    s = state[category]

    # get tomorrow's real date
    tomorrow = datetime.today() + timedelta(days=1)

    month = tomorrow.month
    weekday = tomorrow.weekday()

    features = pd.DataFrame([{
        "Month": month,
        "Weekday Name": weekday,
        f"lag1_{category}": s["lag1"],
        f"lag7_{category}": s["lag7"],
        f"roll7_{category}": s["roll7"],
        f"roll14_{category}": s["roll14"]
    }])

    prediction = model.predict(features)[0]

    return float(prediction)