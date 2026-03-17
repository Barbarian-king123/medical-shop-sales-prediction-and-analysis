document.addEventListener("DOMContentLoaded", function () {

    const dataElement = document.getElementById("dashboardData");

    if (!dataElement) return;

    const dashboardData = JSON.parse(dataElement.dataset.dashboard);

    const atcData = dashboardData.atcDistribution || [];
    const weeklyData = dashboardData.weeklyDayDistribution || [];

    if (atcData.length) {
        new Chart(document.getElementById("pieChart"), {
            type: "pie",
            data: {
                labels: atcData.map(i => i.atc_code),
                datasets: [{
                    data: atcData.map(i => i.total_sales),
                    backgroundColor: [
                        "#1e88e5",
                        "#42a5f5",
                        "#64b5f6",
                        "#90caf9",
                        "#1565c0"
                    ]
                }]
            }
        });
    }

    if (weeklyData.length) {
        new Chart(document.getElementById("barChart"), {
            type: "bar",
            data: {
                labels: weeklyData.map(d => d.day_name),
                datasets: [{
                    label: "Sales (₹)",
                    data: weeklyData.map(d => d.total_sales),
                    backgroundColor: "#1e88e5"
                }]
            }
        });
    }

});