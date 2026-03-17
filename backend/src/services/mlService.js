const axios = require("axios");

const ML_URL = "http://127.0.0.1:8000";

async function predictNextDay(category) {

    const res = await axios.post(
        `${ML_URL}/predict-next-day`,
        { category }
    );

    return res.data.predicted_demand;
}

async function forecast(category, days = 30) {

    const res = await axios.post(
        `${ML_URL}/forecast`,
        { category, days }
    );

    return res.data;
}

module.exports = {
    predictNextDay,
    forecast
};