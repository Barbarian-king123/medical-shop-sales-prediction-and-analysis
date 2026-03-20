document.addEventListener("DOMContentLoaded", function () {

const table = document.getElementById("supplierTable");
const form = document.getElementById("supplierForm");
const details = document.getElementById("supplierDetails");

const toggleBtn = document.getElementById("toggleSupplierForm");
const formContainer = document.getElementById("supplierFormContainer");

// ======================
// Toggle Form
// ======================
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
    const contact_person = document.getElementById("contact_person").value;
    const address = document.getElementById("address").value;
    const gst_number = document.getElementById("gst_number").value;

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
                email,
                contact_person,
                address,
                gst_number
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
// Toggle Status
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

};

// ======================
// View Supplier Details
// ======================
function renderSupplierDetails(supplier){

    const details = document.getElementById("supplierDetails");

    details.style.display = "block";

    details.innerHTML = `
        <h3>Supplier Details</h3>

        <p><b>Name:</b> ${supplier.supplier_name}</p>
        <p><b>Phone:</b> ${supplier.phone || "-"}</p>
        <p><b>Email:</b> ${supplier.email || "-"}</p>
        <p><b>Contact Person:</b> ${supplier.contact_person || "-"}</p>
        <p><b>Address:</b> ${supplier.address || "-"}</p>
        <p><b>GST:</b> ${supplier.gst_number || "-"}</p>

        <button onclick="toggleAssignMedicineForm(${supplier.supplier_id})">
            Assign Medicine
        </button>

        <button onclick="loadSupplierMedicines(${supplier.supplier_id})">
            View Medicines
        </button>

        <button onclick="loadSupplierOrders(${supplier.supplier_id})">
            View Orders
        </button>

        <div id="assignMedicineForm" style="margin-top:10px;"></div>
    `;
}

let currentSupplierId = null;
let currentSupplierData = null; // ⭐ store supplier
window.viewSupplier = async function(id){

    const details = document.getElementById("supplierDetails");

    if(currentSupplierId === id){
        details.innerHTML = "";
        details.style.display = "none";
        currentSupplierId = null;
        currentSupplierData = null;
        return;
    }

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

        currentSupplierId = id;
        currentSupplierData = supplier; // ⭐ store data

        renderSupplierDetails(supplier);

    } catch(err){
        console.error(err);
    }
};
window.goBackToSupplierDetails = function(){

    if(!currentSupplierData) return;

    const details = document.getElementById("supplierDetails");

    details.dataset.view = ""; // reset view
    renderSupplierDetails(currentSupplierData); // ⭐ reuse data
};

// ======================
// Assign Medicine UI
// ======================
window.showAssignMedicineForm = function(supplierId){

    const formDiv = document.getElementById("assignMedicineForm");

    formDiv.innerHTML = `
        <h4>Assign Medicine</h4>

        <input type="text" id="medicine_name" placeholder="Search Medicine" />

        <input type="number" id="price" placeholder="Purchase Price" />

        <input type="number" id="lead_time_days" placeholder="Lead Time (days)" value="3" />

        <label>
            <input type="checkbox" id="is_primary" />
            Primary Supplier
        </label>

        <button onclick="assignMedicine(${supplierId})">Assign</button>

        <div id="medicineSearchResults"></div>
    `;
};

// ======================
// Assign Medicine API
// ======================


document.addEventListener("input", async function(e){

    if(e.target.id === "medicine_name"){

        const term = e.target.value;

        if(term.length < 2) return;

        const res = await fetch(`/api/medicines/search?term=${term}`, {
            credentials: "include"
        });

        const result = await res.json();
        const medicines = result.data || [];

        const resultDiv = document.getElementById("medicineSearchResults");

        resultDiv.innerHTML = "";

        medicines.forEach(m => {

            const item = document.createElement("p");

            item.textContent = m.name + " (" + m.generic_name + ")";

            item.style.cursor = "pointer";

            item.onclick = () => {
                document.getElementById("medicine_name").value = m.name;
                document.getElementById("medicine_name").dataset.id = m.medicine_id;
                resultDiv.innerHTML = "";
            };

            resultDiv.appendChild(item);

        });

    }

});

window.toggleAssignMedicineForm = function(supplierId){

    const formDiv = document.getElementById("assignMedicineForm");

    // 👉 Toggle
    if(formDiv.innerHTML.trim() !== ""){
        formDiv.innerHTML = "";
        return;
    }

    formDiv.innerHTML = `
        <h4>Assign Medicine</h4>

        <input type="text" id="medicine_name" placeholder="Search Medicine" />

        <input type="number" id="price" placeholder="Purchase Price" />

        <input type="number" id="lead_time_days" placeholder="Lead Time (days)" value="3" />

        <label>
            <input type="checkbox" id="is_primary" />
            Primary Supplier
        </label>

        <button onclick="assignMedicine(${supplierId})">Assign</button>

        <div id="medicineSearchResults"></div>
    `;
};
// ======================
// Supplier Medicines (TABLE)
// ======================
window.loadSupplierMedicines = async function(id){

    const details = document.getElementById("supplierDetails");

    // Toggle OFF
    if(details.dataset.view === "medicines"){
        details.innerHTML = "";
        details.style.display = "none";
        details.dataset.view = "";
        return;
    }

    details.dataset.view = "medicines";
    details.style.display = "block";

    try {
        const res = await fetch(`/api/suppliers/${id}/medicines`,{
            credentials:"include"
        });

        const result = await res.json();
        const medicines = result.data || result.medicines || [];

        let html = `
            <button onclick="goBackToSupplierDetails()">⬅ Back</button>
            <h3>Medicines Supplied</h3>
            <table border="1">
                <tr>
                    <th>Name</th>
                    <th>Generic</th>
                    <th>Price</th>
                    <th>Lead Time</th>
                    <th>Primary</th>
                </tr>
        `;

        if(!medicines.length){
            html += `<tr><td colspan="5">No medicines assigned</td></tr>`;
        }

        medicines.forEach(m => {
            html += `
                <tr>
                    <td>${m.name}</td>
                    <td>${m.generic_name || "-"}</td>
                    <td>${m.last_purchase_price || "-"}</td>
                    <td>${m.lead_time_days || 3}</td>
                    <td>${m.is_primary ? "Yes" : "No"}</td>
                </tr>
            `;
        });

        html += `</table>`;

        details.innerHTML = html;

    } catch(err){
        console.error(err);
    }
};
// ======================
// Supplier Orders (TABLE)
// ======================
window.loadSupplierOrders = async function(id){

    const details = document.getElementById("supplierDetails");

    // Toggle OFF
    if(details.dataset.view === "orders"){
        details.innerHTML = "";
        details.style.display = "none";
        details.dataset.view = "";
        return;
    }

    details.dataset.view = "orders";
    details.style.display = "block";

    try {

        const res = await fetch(`/api/suppliers/${id}/orders`,{
            credentials:"include"
        });

        const result = await res.json();
        const orders = result.data || result.orders || [];

        let html = `
            <button onclick="goBackToSupplierDetails()">⬅ Back</button>
            <h3>Supplier Orders</h3>
            <table border="1">
                <tr>
                    <th>Order ID</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
        `;

        if(!orders.length){
            html += `<tr><td colspan="3">No orders found</td></tr>`;
        }

        orders.forEach(o => {
            html += `
                <tr>
                    <td>${o.po_id}</td>
                    <td>${o.status || "-"}</td>
                    <td>${o.order_date 
                        ? new Date(o.order_date).toLocaleDateString("en-IN") 
                        : "-"}</td>
                </tr>
            `;
        });

        html += `</table>`;

        details.innerHTML = html;

    } catch(err){
        console.error(err);
    }
};

// ======================
loadSuppliers();

});