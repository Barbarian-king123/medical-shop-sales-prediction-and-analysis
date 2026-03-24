// ================= FILTER =================
function filterOrders(status, element) {

  loadOrders(status);

  // Remove active from all buttons
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  // Add active to clicked button
  element.classList.add("active");
}


// ================= LOAD ORDERS =================
async function loadOrders(status = "") {

  let url = "/api/orders";

  if (status) {
    url += `?status=${status}`;
  }

  const res = await fetch(url, { credentials: "include" });
  const result = await res.json();

  const table = document.getElementById("ordersTable");
  table.innerHTML = "";

  result.data.forEach(order => {

    let actions = "";

    if (order.status === "Pending") {

      actions = `
        <button onclick="showReceiveForm(${order.po_id})">
          Receive
        </button>

        <button onclick="cancelOrder(${order.po_id})">
          Cancel
        </button>
      `;

    } else if (order.status === "Partially Delivered") {

      actions = `
        <button onclick="showReceiveForm(${order.po_id})">
          Receive
        </button>
      `;

    } else {

      actions = `<span>No Actions</span>`;
    }

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${order.po_id}</td>
      <td>${order.supplier_name}</td>
      <td>${order.medicines || "—"}</td>
      <td>${new Date(order.order_date).toLocaleDateString()}</td>
      <td>${order.status}</td>
      <td>${actions}</td>
    `;

    table.appendChild(row);
  });
}


// ================= RECEIVE FORM =================
let currentOrderId = null;

function showReceiveForm(orderId) {

  const container = document.getElementById("orderDetails");

  container.style.display = "block";
  currentOrderId = orderId;

  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <h3>Receive Order #${orderId}</h3>
      <button onclick="closeReceiveForm()" 
              style="background:red; color:white; border:none; padding:5px 10px; cursor:pointer;">
        ✖
      </button>
    </div>

    <label>Medicine Name</label>
    <input id="medicine_name" placeholder="e.g. Paracetamol"><br><br>

    <label>Batch Number</label>
    <input id="batch_number"><br><br>

    <label>Manufacture Date</label>
    <input type="date" id="mfg_date"><br><br>

    <label>Expiry Date</label>
    <input type="date" id="expiry_date"><br><br>

    <label>Quantity</label>
    <input type="number" id="quantity"><br><br>

    <label>Purchase Price</label>
    <input id="purchase_price"><br><br>

    <label>MRP</label>
    <input id="mrp"><br><br>

    <button onclick="receiveOrder(${orderId})">
      Confirm Receive
    </button>
  `;
}


// ================= RECEIVE ORDER =================
async function receiveOrder(orderId) {

  const batch = {

    // 🔥 CHANGED: name instead of ID
    medicine_name: document.getElementById("medicine_name").value.trim(),

    batch_number: document.getElementById("batch_number").value,
    mfg_date: document.getElementById("mfg_date").value,
    expiry_date: document.getElementById("expiry_date").value,
    quantity: Number(document.getElementById("quantity").value),
    purchase_price: Number(document.getElementById("purchase_price").value),
    mrp: Number(document.getElementById("mrp").value)

  };

  // Basic validation (frontend)
  if (!batch.medicine_name) {
    alert("Medicine name required");
    return;
  }

  const res = await fetch(`/api/orders/${orderId}/receive`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({
      batches: [batch]
    })
  });

  const result = await res.json();

  if (!res.ok) {
    alert(result.message);
    return;
  }

  alert("Order received successfully");

  closeReceiveForm();   // ✅ auto close
  loadOrders();
}


// ================= CANCEL ORDER =================
async function cancelOrder(orderId) {

  if (!confirm("Cancel this order?")) return;

  const res = await fetch(`/api/orders/${orderId}/cancel`, {
    method: "POST",
    credentials: "include"
  });

  const result = await res.json();

  if (!res.ok) {
    alert(result.message);
    return;
  }

  alert("Order cancelled");

  loadOrders();
}


// ================= CLOSE FORM =================
function closeReceiveForm() {
  const container = document.getElementById("orderDetails");
  container.innerHTML = "";
  container.style.display = "none";
  currentOrderId = null;
}


// ================= INIT =================
loadOrders();