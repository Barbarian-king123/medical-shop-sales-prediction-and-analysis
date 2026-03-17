document.addEventListener("DOMContentLoaded", function () {

    const inventoryBody = document.getElementById("inventoryBody");
    const searchInput = document.getElementById("searchInput");
    const batchSection = document.getElementById("batchSection");
    const batchBody = document.getElementById("batchBody");
    const isOwner = window.currentUserRole === "Owner";
    const addBtn = document.getElementById("addMedicineBtn");

    if (addBtn) {
        addBtn.addEventListener("click", () => {
            window.location.href = "/add-medicine";
        });
    }

    // ===============================
    // LOAD MEDICINES
    // ===============================
    async function loadMedicines(search = "") {

        try {

            const res = await fetch(`/api/inventory/search?query=${encodeURIComponent(search)}`, {
                credentials: "include",
                cache: "no-store"
            });

            if (!res.ok) throw new Error("API Error");

            const result = await res.json();

            inventoryBody.innerHTML = "";

            if (!result.data || result.data.length === 0) {

                inventoryBody.innerHTML =
                    `<tr><td colspan="6">No medicines found</td></tr>`;

                return;
            }

            result.data.forEach(med => {

                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${med.name}</td>
                    <td>${med.generic_name || "-"}</td>
                    <td>${med.atc_code || "-"}</td>
                    <td>${med.gst_rate || 0}%</td>
                    <td>${med.total_stock || 0}</td>

                    <td>

                        <button class="restock-medicine-btn" data-id="${med.medicine_id}">
                            Restock
                        </button>

                        <button class="view-btn" data-id="${med.medicine_id}">
                            View Batches
                        </button>

                        <button class="movement-btn" data-id="${med.medicine_id}">
                            Stock Movements
                        </button>

                    </td>
                `;

                inventoryBody.appendChild(row);

            });

        } catch (err) {

            console.error("Error loading medicines:", err);

        }
    }


    // ===============================
    // LOAD BATCHES
    // ===============================
    async function loadBatches(medicineId) {

        try {

            const res = await fetch(`/api/medicines/${medicineId}/batches`, {
                credentials: "include"
            });

            if (!res.ok) throw new Error("Batch API Error");

            const result = await res.json();

            batchBody.innerHTML = "";

            batchSection.classList.remove("hidden");

            if (!result.data || result.data.length === 0) {

                batchBody.innerHTML =
                    `<tr><td colspan="6">No batches available</td></tr>`;

                return;
            }

            result.data.forEach(batch => {

                const row = document.createElement("tr");

                let actionButtons = "";

                if (isOwner) {

                    actionButtons = `
                        <td>

                            <button class="adjust-btn" data-batch="${batch.batch_id}">
                                Adjust
                            </button>

                        </td>
                    `;
                }

                row.innerHTML = `
                    <td>${batch.batch_number}</td>
                    <td>${batch.expiry_date}</td>
                    <td>${batch.quantity}</td>
                    <td>${batch.mrp}</td>
                    <td>${batch.purchase_price}</td>

                    ${isOwner ? actionButtons : ""}
                `;

                batchBody.appendChild(row);

            });

        } catch (err) {

            console.error("Error loading batches:", err);

        }
    }


    // ===============================
    // LOAD STOCK MOVEMENTS
    // ===============================
    function loadStockMovements(medicineId) {

        // redirect to ledger page (or modal later)
        window.location.href = `/inventory/movements/${medicineId}`;

    }


    // ===============================
    // SEARCH EVENT
    // ===============================
    searchInput.addEventListener("keyup", function () {

        loadMedicines(this.value);

    });


    // ===============================
    // INVENTORY TABLE EVENTS
    // ===============================
    inventoryBody.addEventListener("click", function (e) {

    const medicineId = e.target.dataset.id;

    if (e.target.classList.contains("view-btn")) {
        loadBatches(medicineId);
    }

    if (e.target.classList.contains("movement-btn")) {
        loadStockMovements(medicineId);
    }

    if (e.target.classList.contains("restock-medicine-btn")) {
        window.location.href = `/inventory/restock/${medicineId}`;
    }

});


    // ===============================
    // BATCH TABLE EVENTS
    // ===============================
    batchBody.addEventListener("click", function (e) {

        // RESTOCK
        // RESTOCK
        if (e.target.classList.contains("restock-btn")) {

            const batchId = e.target.dataset.batch;

            const qty = prompt("Enter restock quantity");

            if (!qty) return;

            adjustStock(batchId, qty, "Restock");

        }
        // ADJUST STOCK
        if (e.target.classList.contains("adjust-btn")) {

            const batchId = e.target.dataset.batch;

            const changeQty = prompt("Enter quantity adjustment (+ or -)");

            if (changeQty === null) return; // user cancelled

            const qty = Number(changeQty);

            if (isNaN(qty) || qty === 0) {
                alert("Please enter a valid quantity");
                return;
            }

            const reason = prompt("Enter adjustment reason");

            if (!reason) return;

            adjustStock(batchId, changeQty, reason);

        }

    });


    // ===============================
    // ADJUST STOCK API
    // ===============================
async function adjustStock(batchId, changeQty, reason) {

    try {

        const res = await fetch(`/api/inventory/adjust`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "include",

            body: JSON.stringify({
                batch_id: batchId,
                change_qty: Number(changeQty),
                reason: reason
            })

        });

        const result = await res.json();

        if (!res.ok) {
            alert(result.message || "Adjustment failed");
            return;
        }

        alert("Stock adjusted successfully");

        location.reload();

    } catch (err) {

        console.error("Adjustment error:", err);

    }

}


    // ===============================
    // INITIAL LOAD
    // ===============================
    loadMedicines();

});