# import pandas as pd
# weekday_map = {
#     "Monday":0,
#     "Tuesday":1,
#     "Wednesday":2,
#     "Thursday":3,
#     "Friday":4,
#     "Saturday":5,
#     "Sunday":6
# }
# def forecast_category(category, days, models, state, data):

#     model = models[category]
#     s = state[category]

#     month = data["Month"].iloc[-1]
#     weekday_str = data["Weekday Name"].iloc[-1]
#     weekday = weekday_map[weekday_str]

#     forecasts = []

#     # simulate demand history (14 days)
#     history = [s["lag1"]] * 14

#     for d in range(days):

#         lag1 = history[-1]
#         lag7 = history[-7]

#         roll7 = sum(history[-7:]) / 7
#         roll14 = sum(history[-14:]) / 14

#         features = pd.DataFrame([{
#             "Month": month,
#             "Weekday Name": weekday,
#             "lag1_" + category: lag1,
#             "lag7_" + category: lag7,
#             "roll7_" + category: roll7,
#             "roll14_" + category: roll14
#         }])

#         prediction = model.predict(features)[0]

#         forecasts.append(prediction)

#         # update simulated history
#         history.append(prediction)

#         weekday = (weekday + 1) % 7

#     return forecasts

import pandas as pd
from datetime import datetime, timedelta

def forecast_category(category, days, models, state):

    model = models[category]
    s = state[category]

    today = datetime.today()

    history = [s["lag1"]] * 14
    forecasts = []

    current_date = today + timedelta(days=1)

    for d in range(days):

        lag1 = history[-1]
        lag7 = history[-7]

        roll7 = sum(history[-7:]) / 7
        roll14 = sum(history[-14:]) / 14

        features = pd.DataFrame([{
            "Month": current_date.month,
            "Weekday Name": current_date.weekday(),
            f"lag1_{category}": lag1,
            f"lag7_{category}": lag7,
            f"roll7_{category}": roll7,
            f"roll14_{category}": roll14
        }])

        prediction = model.predict(features)[0]

        forecasts.append({
            "date": current_date.strftime("%Y-%m-%d"),
            "predicted_sales": float(prediction)
        })

        history.append(prediction)

        current_date += timedelta(days=1)

    return forecasts