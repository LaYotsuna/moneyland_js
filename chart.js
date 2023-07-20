"use strict";

let myDoughnutChart; // Variable to store the chart instance

// Chart module
export function createDoughnutChart(chartId, receipts, expenses) {
  if (myDoughnutChart) {
    // If a previous chart instance exists, destroy it
    myDoughnutChart.destroy();
  }

  receipts === 0 && expenses === 0 ? ((receipts = 1), (expenses = 1)) : null;

  const ctx = document.getElementById(chartId).getContext("2d");
  myDoughnutChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Receipts", "Expenses"],
      datasets: [
        {
          label: "Doughnut Chart",
          data: [receipts, expenses],
          backgroundColor: ["#40c057", "#fa5252"],
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: true,
          position: "bottom",
        },
      },
      // Optionally, you can customize other chart options here.
    },
  });
}
