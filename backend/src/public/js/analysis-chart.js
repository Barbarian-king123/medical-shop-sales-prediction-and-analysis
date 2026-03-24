/*
====================================
ANALYSIS CHART (ISOLATED)
====================================
*/

let analysisChartInstance = null;

function renderAnalysisChart(forecast) {

  const canvas = document.getElementById("forecastChart");

  if (!canvas) {
    console.error("Analysis chart canvas not found");
    return;
  }

  const ctx = canvas.getContext("2d");

  if (!forecast || !forecast.length) {
    console.error("Forecast data missing");
    return;
  }

  // ✅ Destroy old instance (prevents overlap)
  if (analysisChartInstance) {
    analysisChartInstance.destroy();
  }

  const labels = forecast.map(item => item.date);
  const values = forecast.map(item => item.predicted_sales);

  analysisChartInstance = new Chart(ctx, {

  type: "line",

  data: {
    labels: labels,
    datasets: [{
      label: "Predicted Demand",
      data: values,
      borderColor: "#1e88e5",
      backgroundColor: "rgba(30,136,229,0.2)",
      borderWidth: 2,
      tension: 0.4,
      fill: true,
      pointRadius: 3
    }]
  },

  options: {
  responsive: true,
  maintainAspectRatio: false,

  layout: {
    padding: {
      top: 40,   
      bottom: 10
    }
  },

  plugins: {
    legend: {
      position: "top"
    }
  },

  scales: {
    x: {
      ticks: {
        maxTicksLimit: 8,
        autoSkip: true
      },
      grid: {
        display: false
      }
    },

    y: {
      min: Math.min(...values) - 0.05,
      max: Math.max(...values) + 0.05,
      ticks: {
        stepSize: 0.05
      }
    }
  }
}

});

}