document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("orderForm");
  const supplierSelect = document.getElementById("supplier_id");

  const pathParts = window.location.pathname.split("/");
  const medicineId = pathParts[pathParts.length - 1];

  async function loadSuppliers() {

    const res = await fetch(`/api/inventory/${medicineId}/suppliers`, {
      credentials: "include"
    });

    const result = await res.json();

    supplierSelect.innerHTML = `<option value="">Select Supplier</option>`;

    result.data.forEach(s => {

      const option = document.createElement("option");

      option.value = s.supplier_id;
      option.textContent = s.supplier_name;

      supplierSelect.appendChild(option);

    });
  }

  form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const supplier_id = supplierSelect.value;
    const quantity = document.getElementById("quantity").value;
    const unit_price = document.getElementById("unit_price").value;

    if (!supplier_id) {
      alert("Select supplier");
      return;
    }

    if (quantity <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }

    if (unit_price <= 0) {
      alert("Unit price must be greater than 0");
      return;
    }

    const res = await fetch("/api/purchase", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      credentials: "include",

      body: JSON.stringify({
        supplier_id,
        items: [
          {
            medicine_id: medicineId,
            quantity: Number(quantity),
            unit_price: Number(unit_price)
          }
        ]
      })

    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.message);
      return;
    }

    alert("Purchase order created");

    window.location.href = "/orders";

  });

  loadSuppliers();

});