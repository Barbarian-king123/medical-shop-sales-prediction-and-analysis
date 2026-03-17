document.addEventListener("DOMContentLoaded", function () {

    const chartElement = document.getElementById("forecastChart");

    if (!chartElement) return;

    const dataElement = document.getElementById("analysisData");

    if (!dataElement) return;

    const analysisData = JSON.parse(dataElement.dataset.analysis || "{}");

    const forecast = analysisData.forecast || [];

    if (!forecast.length) return;

    new Chart(chartElement, {

        type: "line",

        data: {

            labels: forecast.map((_, i) => `Day ${i + 1}`),

            datasets: [
                {
                    label: "Predicted Demand",
                    data: forecast,
                    borderColor: "#1e88e5",
                    backgroundColor: "rgba(30,136,229,0.2)",
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }
            ]

        },

        options: {

            responsive: true,

            plugins: {
                legend: {
                    display: true
                }
            }

        }

    });

});