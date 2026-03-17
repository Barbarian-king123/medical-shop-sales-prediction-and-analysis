document.addEventListener("DOMContentLoaded", function () {

const table = document.getElementById("supplierTable");
const form = document.getElementById("supplierForm");
const details = document.getElementById("supplierDetails");

const toggleBtn = document.getElementById("toggleSupplierForm");
const formContainer = document.getElementById("supplierFormContainer");

toggleBtn.addEventListener("click", () => {

    if (formContainer.style.display === "none") {

        formContainer.style.display = "block";
        toggleBtn.textContent = "- Hide Supplier Form";

    } else {

        formContainer.style.display = "none";
        toggleBtn.textContent = "+ Add Supplier";

    }

});
// ======================
// Load Suppliers
// ======================

async function loadSuppliers() {

    try {

        const res = await fetch("/api/suppliers", {
            credentials: "include"
        });

        const result = await res.json();

        const suppliers = result.data || result.suppliers || [];

        table.innerHTML = "";

        suppliers.forEach(supplier => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${supplier.supplier_id}</td>
                <td>${supplier.supplier_name}</td>
                <td>${supplier.phone || "-"}</td>
                <td>${supplier.is_active ? "Active" : "Inactive"}</td>
                <td>
                    <button onclick="viewSupplier(${supplier.supplier_id})">View</button>
                    <button onclick="toggleStatus(${supplier.supplier_id})">Toggle</button>
                </td>
            `;

            table.appendChild(row);

        });

    } catch(err) {
        console.error("Load suppliers error:", err);
    }

}


// ======================
// Create Supplier
// ======================

form.addEventListener("submit", async function(e){

    e.preventDefault();

    const supplier_name = document.getElementById("supplier_name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;

    try {

        const res = await fetch("/api/suppliers", {

            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            credentials:"include",

            body: JSON.stringify({
                supplier_name,
                phone,
                email
            })

        });

        const result = await res.json();

        if(!res.ok){
            alert(result.message || "Failed to create supplier");
            return;
        }

        alert("Supplier created");

        form.reset();

        loadSuppliers();

    } catch(err){
        console.error("Create supplier error:", err);
    }

});


// ======================
// Toggle Supplier Status
// ======================

window.toggleStatus = async function(id){

    try {

        const res = await fetch(`/api/suppliers/${id}/status`,{
            method:"PATCH",
            credentials:"include"
        });

        const result = await res.json();

        if(!res.ok){
            alert(result.message || "Status update failed");
            return;
        }

        loadSuppliers();

    } catch(err){
        console.error("Toggle status error:", err);
    }

}


// ======================
// View Supplier Details
// ======================

window.viewSupplier = async function(id){

    try {

        const res = await fetch(`/api/suppliers/${id}`,{
            credentials:"include"
        });

        const result = await res.json();

        const supplier = result.data || result.supplier;

        if(!supplier){
            details.innerHTML = "<p>Supplier not found</p>";
            return;
        }

        details.innerHTML = `
            <h3>Supplier Details</h3>

            <p><b>Name:</b> ${supplier.supplier_name}</p>
            <p><b>Phone:</b> ${supplier.phone || "-"}</p>
            <p><b>Email:</b> ${supplier.email || "-"}</p>

            <button onclick="loadSupplierMedicines(${supplier.supplier_id})">
                View Medicines
            </button>

            <button onclick="loadSupplierOrders(${supplier.supplier_id})">
                View Orders
            </button>
        `;

    } catch(err){
        console.error("View supplier error:", err);
    }

}


// ======================
// Supplier Medicines
// ======================

window.loadSupplierMedicines = async function(id){

    try {

        const res = await fetch(`/api/suppliers/${id}/medicines`,{
            credentials:"include"
        });

        const result = await res.json();

        const medicines = result.data || result.medicines || [];

        let html = "<h3>Medicines Supplied</h3>";

        if(!medicines.length){
            html += "<p>No medicines assigned</p>";
        }

        medicines.forEach(m => {

            html += `<p>${m.name} (${m.generic_name})</p>`;

        });

        details.innerHTML = html;

    } catch(err){
        console.error("Load medicines error:", err);
    }

}


// ======================
// Supplier Orders
// ======================

window.loadSupplierOrders = async function(id){

    try {

        const res = await fetch(`/api/suppliers/${id}/orders`,{
            credentials:"include"
        });

        const result = await res.json();

        const orders = result.data || result.orders || [];

        let html = "<h3>Supplier Orders</h3>";

        if(!orders.length){
            html += "<p>No orders found</p>";
        }

        orders.forEach(o => {

            html += `<p>Order #${o.po_id} - ${o.status}</p>`;

        });

        details.innerHTML = html;

    } catch(err){
        console.error("Load orders error:", err);
    }

}


// ======================

loadSuppliers();

});