document.addEventListener("DOMContentLoaded", function () {

    const notificationBody = document.getElementById("notificationBody");

    // ===============================
    // LOAD NOTIFICATIONS
    // ===============================
    async function loadNotifications() {

    const notificationBody = document.getElementById("notificationBody");

    if (!notificationBody) {
        console.error("notificationBody missing!");
        return;
    }

    try {

        const res = await fetch("/api/notifications", {
            credentials: "include"
        });

        const result = await res.json();

        console.log("API RESPONSE:", result);

        const notifications = Array.isArray(result) ? result : result.data || [];

        notificationBody.innerHTML = "";

        if (!notifications.length) {
            notificationBody.innerHTML = `
                <tr>
                    <td colspan="4">No notifications</td>
                </tr>
            `;
            return;
        }

        notifications.forEach(n => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${n.alert_type || "-"}</td>
                <td>${n.medicine_name || "-"}</td>
                <td>Reorder at ${n.reorder_point}</td>
                <td>${new Date(n.created_at).toLocaleString()}</td>
            `;

            notificationBody.appendChild(row);
        });

    } catch (err) {
        console.error("Error:", err);
    }
}

    // ===============================
    // CHECK EXPIRY
    // ===============================
    document.getElementById("checkExpiry").addEventListener("click", async () => {

        try {

            const res = await fetch("/api/notifications/check-expiry", {
                method: "POST",
                credentials: "include"
            });

            const result = await res.json();

            alert(result.message || "Expiry check done");

            loadNotifications();

        } catch (err) {
            console.error(err);
        }

    });

    // ===============================
    // CHECK STOCK
    // ===============================
    document.getElementById("checkStock").addEventListener("click", async () => {

        try {

            const res = await fetch("/api/notifications/check-stock", {
                method: "POST",
                credentials: "include"
            });

            const result = await res.json();

            alert(result.message || "Stock check done");

            loadNotifications();

        } catch (err) {
            console.error(err);
        }

    });

    // ===============================
    // INITIAL LOAD
    // ===============================
    loadNotifications();

});