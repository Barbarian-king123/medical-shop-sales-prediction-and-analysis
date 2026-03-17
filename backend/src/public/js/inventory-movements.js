document.addEventListener("DOMContentLoaded", async function () {

    const movementBody = document.getElementById("movementBody");

    // Get medicineId from URL
    const pathParts = window.location.pathname.split("/");
    const medicineId = pathParts[pathParts.length - 1];

    try {

        const res = await fetch(`/api/inventory/movements/${medicineId}`, {
            credentials: "include"
        });

        if (!res.ok) throw new Error("API error");

        const result = await res.json();

        movementBody.innerHTML = "";

        if (!result.data || result.data.length === 0) {

            movementBody.innerHTML =
                `<tr><td colspan="4">No stock movements found</td></tr>`;

            return;
        }

        result.data.forEach(m => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${new Date(m.created_at).toLocaleDateString()}</td>
                <td>${m.batch_number}</td>
                <td>${m.change_qty}</td>
                <td>${m.reason}</td>
            `;

            movementBody.appendChild(row);

        });

    } catch (err) {

        console.error("Error loading stock movements:", err);

    }

});