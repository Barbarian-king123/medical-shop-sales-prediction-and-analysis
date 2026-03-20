function filterOrders(status) {

  // 👉 Load orders
  loadOrders(status);

  // 👉 Remove active from all buttons
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  // 👉 Add active to clicked button
  event.target.classList.add("active");
}

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

    }

    else if (order.status === "Partially Delivered") {

      actions = `
        <button onclick="showReceiveForm(${order.po_id})">
          Receive
        </button>
      `;

    }

    else {

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


let currentOrderId = null;
function showReceiveForm(orderId) {

  const container = document.getElementById("orderDetails");

  // 👉 If same order clicked → hide
  if (currentOrderId === orderId) {
    container.innerHTML = "";
    container.style.display = "none"; // hide container
    currentOrderId = null;
    return;
  }

  // 👉 Show container
  container.style.display = "block";
  currentOrderId = orderId;

  container.innerHTML = `
    <h3>Receive Order #${orderId}</h3>

    <label>Medicine ID</label>
    <input id="medicine_id"><br><br>

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



async function receiveOrder(orderId) {

  const batch = {

    medicine_id: document.getElementById("medicine_id").value,
    batch_number: document.getElementById("batch_number").value,
    mfg_date: document.getElementById("mfg_date").value,
    expiry_date: document.getElementById("expiry_date").value,
    quantity: Number(document.getElementById("quantity").value),
    purchase_price: Number(document.getElementById("purchase_price").value),
    mrp: Number(document.getElementById("mrp").value)

  };

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

  loadOrders();

}



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



loadOrders();