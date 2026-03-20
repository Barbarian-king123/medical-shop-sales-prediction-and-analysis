document.addEventListener("DOMContentLoaded", function () {

    const dataElement = document.getElementById("dashboardData");
    if (!dataElement) return;

    const dashboardData = JSON.parse(dataElement.dataset.dashboard);

    const atcData = dashboardData.atcDistribution || [];
    const weeklyData = dashboardData.weeklyDayDistribution || [];

    console.log(weeklyData);

    /* ================= PIE (DOUGHNUT) CHART ================= */
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
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,

            // ✅ THIS is the correct way to reduce size
            elements: {
                arc: {
                    radius: "70%"   // 🔥 change this (60%–80%)
                }
            },

            layout: {
                padding: 20
            },

            plugins: {
                legend: {
                    position: "top"
                }
            }
        }
    });
}

    /* ================= BAR CHART ================= */
    if (weeklyData.length) {
    new Chart(document.getElementById("barChart"), {
        type: "bar",
        data: {
            labels: weeklyData.map(d => d.day_name),
            datasets: [{
                label: "Sales (₹)",
                data: weeklyData.map(d => d.total_sales),
                backgroundColor: "#1e88e5",
                borderRadius: 6,

                // 🔥 PERFECT BALANCE
                categoryPercentage: 0.7,  // space between groups
                barPercentage: 0.8        // thickness of bars
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,

            layout: {
                padding: 0   // 🔥 remove extra space
            },

            plugins: {
                legend: {
                    display: true
                }
            },

            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

});