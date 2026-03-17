document.addEventListener("DOMContentLoaded", function () {

    console.log("Sales JS Loaded");

    const loadBtn = document.getElementById("loadReport");

    if (!loadBtn) {
        console.error("Load Report button not found");
        return;
    }

    loadBtn.addEventListener("click", async function () {

        console.log("Load Report clicked");

        const startDate = document.getElementById("startDate").value;
        const endDate = document.getElementById("endDate").value;

        if (!startDate || !endDate) {
            alert("Please select both start and end dates");
            return;
        }

        try {

            // Fetch Summary
            const summaryRes = await fetch(
                `/api/reports/summary?startDate=${startDate}&endDate=${endDate}`,
                { credentials: "include" }
            );

            const summaryData = await summaryRes.json();

            if (summaryRes.ok) {

                document.getElementById("totalBills").innerText =
                    summaryData.data.totalBills;

                document.getElementById("totalSales").innerText =
                    "₹" + summaryData.data.totalSales;

                document.getElementById("gstCollected").innerText =
                    "₹" + summaryData.data.gstCollected;

                document.getElementById("netProfit").innerText =
                    "₹" + summaryData.data.netProfit;
            }

            // Fetch Generic Report
            const genericRes = await fetch(
                `/api/reports/sales/generic?startDate=${startDate}&endDate=${endDate}`,
                { credentials: "include" }
            );

            const genericData = await genericRes.json();

            const tbody = document.getElementById("salesTableBody");
            tbody.innerHTML = "";

            if (genericRes.ok && genericData.data.length) {

                genericData.data.forEach(item => {

                    const row = document.createElement("tr");

                    row.innerHTML = `
                        <td>${item.generic_name}</td>
                        <td>${item.total_units_sold}</td>
                        <td>₹${item.total_sales}</td>
                        <td>₹${item.total_gst}</td>
                        <td>₹${item.net_profit}</td>
                    `;

                    tbody.appendChild(row);
                });

            } else {
                tbody.innerHTML =
                    `<tr><td colspan="5">No data found</td></tr>`;
            }

        } catch (err) {
            console.error("Report Error:", err);
            alert("Failed to load report");
        }

    });

});