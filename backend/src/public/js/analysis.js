/*
====================================
WAIT FOR DOM
====================================
*/

document.addEventListener("DOMContentLoaded", () => {

  setupSearch();

  if (document.getElementById("medicineTableBody")) {
    loadMedicines();
  }

  if (typeof medicineId !== "undefined" && medicineId) {
    console.log("Loading analysis for medicine:", medicineId);
    loadAnalysisPage(medicineId);
  }

});


/*
====================================
LOAD MEDICINES
====================================
*/

async function loadMedicines(query = "") {

  try {

    let url = "/api/analysis/medicines";

    if (query) {
      url = `/api/analysis/search?q=${query}`;
    }

    const res = await fetch(url, {
      credentials: "include"
    });

    if (!res.ok) {
      throw new Error("Failed to fetch medicines");
    }

    const result = await res.json();

    const table = document.getElementById("medicineTableBody");

    if (!table) return;

    table.innerHTML = "";

    result.data.forEach(med => {

      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${med.name}</td>
        <td>${med.generic_name || "—"}</td>
        <td>${med.atc_code}</td>
        <td>${med.total_stock || 0}</td>

        <td>
          <button onclick="openAnalysis(${med.medicine_id})">
            Analyze
          </button>
        </td>
      `;

      table.appendChild(row);

    });

  }
  catch (err) {
    console.error("Medicine loading error:", err);
  }

}


/*
====================================
SEARCH MEDICINES
====================================
*/

function setupSearch() {

  const input = document.getElementById("medicineSearch");

  if (!input) return;

  input.addEventListener("input", () => {

    const query = input.value.trim();

    loadMedicines(query);

  });

}


/*
====================================
OPEN ANALYSIS PAGE
====================================
*/

function openAnalysis(id) {

  window.location.href = `/analysis/medicine/${id}`;

}


/*
====================================
LOAD ANALYSIS PAGE
====================================
*/

async function loadAnalysisPage(medicineId) {

  try {

    const res = await fetch("/api/analysis/forecast", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      credentials: "include",

      body: JSON.stringify({
        medicineId
      })

    });

    if (!res.ok) {
      throw new Error("Forecast API failed");
    }

    const result = await res.json();

    console.log("Forecast data:", result);

    const data = result.data;

    document.getElementById("medicineName").innerText = data.medicineName;
    document.getElementById("currentStock").innerText = data.currentStock;
    document.getElementById("todayDemand").innerText = data.todayDemand;
    document.getElementById("safetyStock").innerText = data.safetyStock;
    document.getElementById("suggestedRestock").innerText = data.suggestedRestock;

    drawChart(data.forecast);

    const loading = document.getElementById("loadingSection");
    const content = document.getElementById("analysisContent");

    if (loading) loading.style.display = "none";
    if (content) content.style.display = "block";

  }
  catch (err) {

    console.error("Analysis loading error:", err);

  }

}


/*
====================================
DRAW FORECAST GRAPH
====================================
*/

let chartInstance = null;

function drawChart(forecast){

  const canvas = document.getElementById("forecastChart");

  if(!canvas){
    console.error("Canvas not found");
    return;
  }

  const ctx = canvas.getContext("2d");

  if(!forecast || !forecast.length){
    console.error("Forecast data missing");
    return;
  }

  // extract dates and sales values
  const labels = forecast.map(item => item.date);
  const values = forecast.map(item => item.predicted_sales);

  new Chart(ctx,{

    type:"line",

    data:{
      labels: labels,

      datasets:[{
        label:"Predicted Demand",
        data: values,
        borderColor:"#1e88e5",
        backgroundColor:"rgba(30,136,229,0.2)",
        borderWidth:2,
        tension:0.3,
        fill:true
      }]
    },

    options:{
      responsive:true,
      maintainAspectRatio:false,

      scales:{
        x:{
          title:{
            display:true,
            text:"Date"
          }
        },
        y:{
          title:{
            display:true,
            text:"Predicted Sales"
          }
        }
      }

    }

  });

}