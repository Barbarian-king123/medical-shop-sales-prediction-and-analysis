document.addEventListener("DOMContentLoaded", function () {

    const lowStockBody = document.getElementById("lowStockBody");
    const expiryBody = document.getElementById("expiryBody");

    const lowStockSection = document.getElementById("lowStockSection");
    const expirySection = document.getElementById("expirySection");

    const btnLowStock = document.getElementById("showLowStock");
    const btnExpiry = document.getElementById("showExpiry");

    // ===============================
    // ACTIVE TAB HANDLER (FIXED)
    // ===============================
    function setActiveTab(activeBtn) {

        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.classList.remove("active");   // remove from all
        });

        activeBtn.classList.add("active");   // add only to clicked
    }

    // ===============================
    // LOAD LOW STOCK
    // ===============================
    async function loadLowStock() {

        try {

            const res = await fetch("/api/notifications/low-stock", {
                credentials: "include"
            });

            const data = await res.json();

            lowStockBody.innerHTML = "";

            if (!data.length) {
                lowStockBody.innerHTML = `
                    <tr>
                        <td colspan="5">No low stock alerts</td>
                    </tr>
                `;
                return;
            }

            data.forEach(n => {

                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${n.medicine_name || "-"}</td>
                    <td>${n.current_stock ?? "-"}</td>
                    <td>${n.reorder_point ?? "-"}</td>
                    <td>${n.created_at 
                        ? new Date(n.created_at).toLocaleString("en-IN") 
                        : "-"}</td>
                    <td>
                        <button class="clear-btn" data-id="${n.notification_id}">
                            Clear
                        </button>
                    </td>
                `;

                row.classList.add("low-stock-row");

                lowStockBody.appendChild(row);
            });

        } catch (err) {
            console.error("Low stock load error:", err);
        }
    }

    // ===============================
    // LOAD EXPIRY
    // ===============================
    async function loadExpiry() {

        try {

            const res = await fetch("/api/notifications/expiry", {
                credentials: "include"
            });

            const data = await res.json();

            expiryBody.innerHTML = "";

            if (!data.length) {
                expiryBody.innerHTML = `
                    <tr>
                        <td colspan="6">No expiry alerts</td>
                    </tr>
                `;
                return;
            }

            data.forEach(n => {

                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${n.alert_type || "-"}</td>
                    <td>${n.medicine_name || "-"}</td>
                    <td>${n.batch_number || "-"}</td>
                    <td>${n.expiry_date 
                        ? new Date(n.expiry_date).toLocaleDateString("en-IN") 
                        : "-"}</td>
                    <td>${n.created_at 
                        ? new Date(n.created_at).toLocaleString("en-IN") 
                        : "-"}</td>
                    <td>
                        <button class="clear-btn" data-id="${n.notification_id}">
                            Clear
                        </button>
                    </td>
                `;

                if (n.alert_type === "Expired") {
                    row.classList.add("expired-row");
                } else {
                    row.classList.add("expiry-risk-row");
                }

                expiryBody.appendChild(row);
            });

        } catch (err) {
            console.error("Expiry load error:", err);
        }
    }

    // ===============================
    // TAB SWITCHING
    // ===============================
    btnLowStock.addEventListener("click", () => {

        setActiveTab(btnLowStock);

        lowStockSection.style.display = "block";
        expirySection.style.display = "none";

        loadLowStock();
    });

    btnExpiry.addEventListener("click", () => {

        setActiveTab(btnExpiry);

        lowStockSection.style.display = "none";
        expirySection.style.display = "block";

        loadExpiry();
    });

    // ===============================
    // CLEAR SINGLE
    // ===============================
    document.addEventListener("click", async (e) => {

        if (e.target.classList.contains("clear-btn")) {

            const id = e.target.dataset.id;

            if (!confirm("Clear this notification?")) return;

            try {

                const res = await fetch(`/api/notifications/${id}/resolve`, {
                    method: "PATCH",
                    credentials: "include"
                });

                const result = await res.json();

                if (!res.ok) {
                    alert(result.message || "Failed to clear");
                    return;
                }

                // reload visible section
                if (lowStockSection.style.display !== "none") {
                    loadLowStock();
                } else {
                    loadExpiry();
                }

            } catch (err) {
                console.error(err);
            }

        }

    });

    // ===============================
    // CLEAR ALL
    // ===============================
    document.getElementById("clearAllNotifications")
        ?.addEventListener("click", async () => {

        if (!confirm("Clear all notifications?")) return;

        try {

            const res = await fetch("/api/notifications/clear-all", {
                method: "PATCH",
                credentials: "include"
            });

            const result = await res.json();

            if (!res.ok) {
                alert(result.message || "Failed to clear all");
                return;
            }

            loadLowStock();
            loadExpiry();

        } catch (err) {
            console.error(err);
        }

    });

    // ===============================
    // CHECK BUTTONS
    // ===============================
    document.getElementById("checkExpiry").addEventListener("click", async () => {

        await fetch("/api/notifications/check-expiry", {
            method: "POST",
            credentials: "include"
        });

        setActiveTab(btnExpiry);
        lowStockSection.style.display = "none";
        expirySection.style.display = "block";

        loadExpiry();
    });

    document.getElementById("checkStock").addEventListener("click", async () => {

        await fetch("/api/notifications/check-stock", {
            method: "POST",
            credentials: "include"
        });

        setActiveTab(btnLowStock);
        lowStockSection.style.display = "block";
        expirySection.style.display = "none";

        loadLowStock();
    });

    // ===============================
    // INITIAL LOAD (DEFAULT)
    // ===============================
    setActiveTab(btnLowStock);   // ✅ only one active
    lowStockSection.style.display = "block";
    expirySection.style.display = "none";

    loadLowStock();

});