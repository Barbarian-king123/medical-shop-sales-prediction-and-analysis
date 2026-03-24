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
        const res = await fetch("/api/suppliers", { credentials: "include" });
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
        console.error(err);
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
            headers: { "Content-Type":"application/json" },
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
            alert(result.message);
            return;
        }

        alert("Supplier created");
        form.reset();
        loadSuppliers();

    } catch(err){
        console.error(err);
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
            alert(result.message);
            return;
        }

        loadSuppliers();

    } catch(err){
        console.error(err);
    }
};

// ======================
// GLOBAL STATE
// ======================
let currentSupplierId = null;
let currentSupplierData = null;

// ======================
// RENDER DETAILS (KEY FIX)
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

        <div style="margin-top:10px;">
            <button onclick="toggleAssignMedicineForm(${supplier.supplier_id})">
                Assign Medicine
            </button>

            <button onclick="loadSupplierMedicines(${supplier.supplier_id})">
                View Medicines
            </button>

            <button onclick="loadSupplierOrders(${supplier.supplier_id})">
                View Orders
            </button>
        </div>

        <div id="assignMedicineForm" style="margin-top:15px;"></div>
    `;
}

// ======================
// VIEW SUPPLIER
// ======================
window.viewSupplier = async function(id){

    const details = document.getElementById("supplierDetails");

    if(currentSupplierId === id){
        details.innerHTML = "";
        details.style.display = "none";
        currentSupplierId = null;
        currentSupplierData = null;
        return;
    }

    const res = await fetch(`/api/suppliers/${id}`,{ credentials:"include" });
    const result = await res.json();
    const supplier = result.data || result.supplier;

    currentSupplierId = id;
    currentSupplierData = supplier;

    renderSupplierDetails(supplier);
};

// ======================
// BACK FUNCTION (FIXED)
// ======================
window.goBackToSupplierDetails = function(){
    if(!currentSupplierData) return;
    renderSupplierDetails(currentSupplierData);
};

// ======================
// VIEW MEDICINES
// ======================
window.loadSupplierMedicines = async function(id){

    const details = document.getElementById("supplierDetails");

    const res = await fetch(`/api/suppliers/${id}/medicines`, {
        credentials: "include"
    });

    const result = await res.json();
    const medicines = result.data || result.medicines || [];

    let html = `
        <button onclick="goBackToSupplierDetails()">⬅ Back</button>
        <h3>Medicines Supplied</h3>

        <table>
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
};

// ======================
// VIEW ORDERS
// ======================
window.loadSupplierOrders = async function(id){

    const details = document.getElementById("supplierDetails");

    const res = await fetch(`/api/suppliers/${id}/orders`, {
        credentials: "include"
    });

    const result = await res.json();
    const orders = result.data || result.orders || [];

    let html = `
        <button onclick="goBackToSupplierDetails()">⬅ Back</button>
        <h3>Supplier Orders</h3>

        <table>
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
                <td>${o.order_date ? new Date(o.order_date).toLocaleDateString("en-IN") : "-"}</td>
            </tr>
        `;
    });

    html += `</table>`;
    details.innerHTML = html;
};

// ======================
// ASSIGN MEDICINE FORM
// ======================
window.toggleAssignMedicineForm = function(supplierId){

    const formDiv = document.getElementById("assignMedicineForm");

    if(formDiv.innerHTML.trim() !== ""){
        formDiv.innerHTML = "";
        return;
    }

    formDiv.innerHTML = `
        <div class="assign-card">

            <h4>💊 Assign Medicine</h4>

            <div class="form-group">
                <label>Medicine Name</label>
                <input type="text" id="medicine_name">
            </div>

            <div class="form-group">
                <label>Price</label>
                <input type="number" id="price">
            </div>

            <div class="form-group">
                <label>Lead Time</label>
                <input type="number" id="lead_time_days" value="3">
            </div>

            <label>
                <input type="checkbox" id="is_primary"> Primary
            </label>

            <button class="btn-assign" onclick="assignMedicine(${supplierId})">
                Assign
            </button>
        </div>
    `;
};

// ======================
// ASSIGN MEDICINE API
// ======================
window.assignMedicine = async function(supplierId){

    const medicineName = document.getElementById("medicine_name").value.trim();
    const price = document.getElementById("price").value;
    const leadTime = document.getElementById("lead_time_days").value;
    const isPrimary = document.getElementById("is_primary").checked;

    if(!medicineName){
        alert("Enter medicine name");
        return;
    }

    const res = await fetch(`/api/suppliers/${supplierId}/medicines`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
            medicine_name: medicineName,
            last_purchase_price: price ? Number(price) : null,
            lead_time_days: leadTime ? Number(leadTime) : 3,
            is_primary: isPrimary
        })
    });

    const result = await res.json();

    if(!res.ok){
        alert(result.message);
        return;
    }

    alert("Medicine assigned");

    document.getElementById("medicine_name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("lead_time_days").value = 3;
    document.getElementById("is_primary").checked = false;
};

// ======================
loadSuppliers();

});