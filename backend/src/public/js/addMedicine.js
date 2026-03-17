document.getElementById("addMedicineForm")
.addEventListener("submit", async function (e) {

    e.preventDefault();

    const formData = new FormData(this);

    const data = Object.fromEntries(formData.entries());

    try {
        const res = await fetch("/api/medicines", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (!res.ok) throw new Error(result.message);

        alert("Medicine added successfully");

        window.location.href = "/inventory";

    } catch (err) {
        alert("Error: " + err.message);
    }
});