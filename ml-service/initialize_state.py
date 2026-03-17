def initialize_state(categories, avg_sales):

    state = {}

    for cat in categories:
        avg = avg_sales[cat]

        state[cat] = {
            "lag1": avg,
            "lag7": avg,
            "roll7": avg,
            "roll14": avg
        }

    return state