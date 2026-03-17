document.addEventListener("DOMContentLoaded", function () {

    const billingBody = document.getElementById("billingBody");
    const addRowBtn = document.getElementById("addRow");

    // ===============================
    // CREATE NEW ROW
    // ===============================
    function createRow() {

        const row = document.createElement("tr");
        row.classList.add("billing-row");

        row.innerHTML = `
            <td>
                <input type="text" class="brandSearch" placeholder="Search brand..." autocomplete="off">
                <div class="search-results"></div>
            </td>
            <td class="generic"></td>
            <td class="batch"></td>
            <td class="expiry"></td>
            <td><input type="number" class="qty" value="1" min="1"></td>
            <td class="mrp"></td>
            <td class="gst"></td>
            <td class="lineTotal">0.00</td>
            <td><button type="button" class="removeRow">X</button></td>
        `;

        billingBody.appendChild(row);
        attachRowEvents(row);
    }

    // ===============================
    // ATTACH EVENTS TO ROW
    // ===============================
    function attachRowEvents(row) {

        const searchInput = row.querySelector(".brandSearch");
        const resultsBox = row.querySelector(".search-results");
        const qtyInput = row.querySelector(".qty");
        const removeBtn = row.querySelector(".removeRow");

        // 🔍 SEARCH MEDICINE
        searchInput.addEventListener("input", async function () {

            const query = this.value.trim();

            if (!query) {
                resultsBox.style.display = "none";
                return;
            }

            try {

                const res = await fetch(`/api/medicines/search?query=${query}`, {
                    credentials: "include"
                });

                const result = await res.json();
                const medicines = result.data || [];

                resultsBox.innerHTML = "";

                if (!medicines.length) {
                    resultsBox.style.display = "none";
                    return;
                }

                resultsBox.style.display = "block";

                medicines.forEach(med => {

                    const div = document.createElement("div");

                    // Show batch info in dropdown
                    div.textContent =
                        `${med.name} | Batch: ${med.batch_number} | Exp: ${
                            med.expiry_date ? new Date(med.expiry_date).toLocaleDateString() : "-"
                        } | ₹${med.mrp}`;

                    div.addEventListener("click", () => {

                        searchInput.value = med.name;

                        // Fill medicine details
                        row.querySelector(".generic").textContent = med.generic_name || "";
                        row.querySelector(".batch").textContent = med.batch_number || "";
                        row.querySelector(".expiry").textContent =
                            med.expiry_date
                                ? new Date(med.expiry_date).toLocaleDateString()
                                : "";

                        row.querySelector(".gst").textContent = med.gst_rate || 0;
                        row.querySelector(".mrp").textContent = med.mrp || 0;

                        // Store important values
                        row.dataset.mrp = med.mrp || 0;
                        row.dataset.medicineId = med.medicine_id;
                        row.dataset.batchId = med.batch_id;

                        resultsBox.style.display = "none";

                        updateLine(row);
                    });

                    resultsBox.appendChild(div);
                });

            } catch (err) {
                console.error("Search error:", err);
            }

        });

        // Qty change
        qtyInput.addEventListener("input", () => updateLine(row));

        // Remove row
        removeBtn.addEventListener("click", () => {
            row.remove();
            updateGrandTotal();
        });

    }

    // ===============================
    // UPDATE LINE TOTAL
    // ===============================
    function updateLine(row) {

        const qty = Number(row.querySelector(".qty").value);
        const mrp = parseFloat(row.dataset.mrp || 0);

        const total = qty * mrp;

        row.querySelector(".lineTotal").textContent = total.toFixed(2);

        updateGrandTotal();
    }

    // ===============================
    // UPDATE GRAND TOTAL
    // ===============================
    function updateGrandTotal() {

        let total = 0;

        document.querySelectorAll(".lineTotal").forEach(cell => {
            total += Number(cell.textContent);
        });

        document.getElementById("grandTotal").textContent = total.toFixed(2);
    }

    // ===============================
    // COMPLETE SALE
    // ===============================
    const completeBtn = document.getElementById("completeSale");

    completeBtn.addEventListener("click", async function () {

        const rows = document.querySelectorAll(".billing-row");

        const items = [];

        rows.forEach(row => {

            const medicineId = row.dataset.medicineId;
            const qty = Number(row.querySelector(".qty").value);

            if (medicineId && qty > 0) {

                items.push({
                    medicine_id: Number(medicineId),
                    quantity: qty
                });

            }

        });

        if (!items.length) {
            alert("No medicines selected");
            return;
        }

        try {

            const res = await fetch("/api/sales", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ items })
            });

            const result = await res.json();

            if (!res.ok) {
                alert(result.message || "Sale failed");
                return;
            }

            alert("Sale completed successfully!");

            window.location.reload();

        } catch (err) {
            console.error("Sale error:", err);
            alert("Something went wrong");
        }

    });

    // ===============================
    // INITIAL ROW
    // ===============================
    attachRowEvents(document.querySelector(".billing-row"));

    // ===============================
    // ADD ROW
    // ===============================
    addRowBtn.addEventListener("click", createRow);

});