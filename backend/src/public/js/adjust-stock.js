document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("adjustForm");

    // Get batchId from URL
    const pathParts = window.location.pathname.split("/");
    const batchId = pathParts[pathParts.length - 1];

    const batchInput = document.getElementById("batch_id");

    // Set batch id in form
    if (batchInput) {
        batchInput.value = batchId;
    }

    // ==========================
    // SUBMIT ADJUSTMENT
    // ==========================
    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        const changeQty = document.getElementById("change_qty").value;
        const reason = document.getElementById("reason").value;

        if (!changeQty) {
            alert("Quantity required");
            return;
        }

        if (!reason) {
            alert("Reason required");
            return;
        }

        try {

            const res = await fetch("/api/inventory/adjust", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                credentials: "include",

                body: JSON.stringify({
                    batch_id: batchId,
                    change_qty: parseInt(changeQty),
                    reason: reason
                })

            });

            const result = await res.json();

            if (!res.ok) {
                alert(result.message || "Adjustment failed");
                return;
            }

            alert("Stock adjusted successfully");

            window.location.href = "/inventory";

        } catch (err) {

            console.error("Adjust error:", err);

        }

    });

});