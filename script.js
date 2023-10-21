<<<<<<< HEAD
"use strict";
import { createDoughnutChart } from "./chart.js";

// Selected elements
const mainDate = document.querySelector(".date");
const transactionType = document.getElementById("type");
const addTransactionBtn = document.getElementById("btn");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const transactionDivider = document.querySelector(".transaction-divider");
const budget = document.querySelector(".money");

// Global variables
let currentBudget = 0;
let receipts = 0;
let expenses = 0;
let timeAndDate;

// Exports
export default currentBudget;

// Functions
// Get current month name and year
const getMonthAndYear = function () {
  const dateNow = new Date();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = dateNow.getMonth();
  const year = dateNow.getFullYear();
  const monthName = monthNames[month];
  return (mainDate.innerHTML = `${monthName} ${year}`);
};

// Get transaction type selection
const getTransactionType = function () {
  const selectedOption = transactionType.options[transactionType.selectedIndex];
  const selectedValue = selectedOption.value;
  return selectedValue;
};

// Get input field values
const getDescriptionValue = function () {
  const descriptionValue = descriptionInput.value;
  return descriptionValue;
};

const getAmountValue = function () {
  const amountValue = amountInput.value;
  return amountValue;
};

// Clear inputs fields
const clearInputs = function () {
  //Set select to default
  transactionType.value = transactionType.options[0].value;
  // Clear description and value
  descriptionInput.value = "";
  amountInput.value = "";
};

// Update budget sum based on transactions
const updateBudget = function (optionSelected, moneyAmount) {
  // Update current budget
  optionSelected === "revenue"
    ? (currentBudget += moneyAmount)
    : (currentBudget -= moneyAmount);
  budget.innerHTML = `$ ${currentBudget.toLocaleString("en-US")}`;
};

const updateBudgetColor = function () {
  budget.style.color = currentBudget >= 0 ? "#66a80f" : "#e03131";
};

// Update budget sum based on transactions
const updateReceiptsAndExpenses = function (optionSelected, moneyAmount) {
  // Update current budget
  optionSelected === "revenue"
    ? (receipts += moneyAmount)
    : (expenses += moneyAmount);
};

const getTimeAndDate = function () {
  // Current time and date
  const currentTime = new Date();
  const hour = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const day = currentTime.getDate();
  const month = currentTime.getMonth() + 1;
  const year = currentTime.getFullYear();
  timeAndDate = {
    hour: hour,
    minutes: minutes,
    day: day,
    month: month,
    year: year,
  };
  return timeAndDate;
};

// Function to save transaction data to local storage
const saveTransactionData = function (transactionData) {
  localStorage.setItem("transactionData", JSON.stringify(transactionData));
};

//Event Listeners
// Event listener on the add  value button to choose the type of the trasaction
addTransactionBtn.addEventListener("click", function () {
  const description = getDescriptionValue();
  const amount = getAmountValue().replace(/[^\d.]/g, "");
  const selected = getTransactionType();
  const dateAndTime = getTimeAndDate();

  if (amount > 5000000 || amount < -5000000) {
    return alert("We only accept values up to $ 5,000.000, you're too rich!");
  } else if (selected && description && amount) {
    const parsedAmount = parseFloat(amount.replace(/,/g, ""));

    const htmlContent = `
      <div class="transaction-details">
        <div class="transaction-timing">
          <span class="transaction-date">Date: ${String(
            dateAndTime.day
          ).padStart(2, "0")}/${String(dateAndTime.month).padStart(2, "0")}/${
      dateAndTime.year
    }</span>
          <span class="transaction-time">Time: ${String(
            dateAndTime.hour
          ).padStart(2, "0")}:${String(dateAndTime.minutes).padStart(
      2,
      "0"
    )}</span>
        </div>
        <span class="transaction-description">${
          description[0].toUpperCase() + description.split("").slice(1).join("")
        }</span>
      </div>
      <div class="transaction-value">
        <span class="transaction-amount ${
          selected === "revenue" ? "revenue" : "expense"
        }">$ ${parsedAmount.toLocaleString("en-US")}</span>
      </div>
    `;

    transactionDivider.insertAdjacentHTML("afterbegin", htmlContent);

    clearInputs();
    updateBudget(selected, parsedAmount);
    updateBudgetColor();
    updateReceiptsAndExpenses(selected, parsedAmount);

    // Update local storage
    const transactionData = {
      currentBudget,
      receipts,
      expenses,
      transactions: [
        { htmlContent, selected, parsedAmount, dateAndTime, description },
        ...(localStorage.getItem("transactionData")
          ? JSON.parse(localStorage.getItem("transactionData")).transactions
          : []),
      ],
    };

    saveTransactionData(transactionData);

    // Update the doughnut chart after storing the data
    createDoughnutChart("myDoughnutChart", receipts, expenses);
  } else {
    return alert(
      "Please select an option and provide values in both input areas."
    );
  }
});

// Event listener in the HTML document so the amount typed in the input area gets formatted as the user type so 1000 becomes 1,000 and so on
document.addEventListener("DOMContentLoaded", function () {
  const amountInput = document.getElementById("amount");

  amountInput.addEventListener("input", function (event) {
    setTimeout(() => {
      const inputValue = event.target.value;
      const parts = inputValue.split(".");
      const wholePart = parts[0].replace(/\D/g, "");
      const decimalPart = parts[1];

      const formattedWholePart = new Intl.NumberFormat("en-EN").format(
        wholePart
      );
      const formattedValue =
        decimalPart !== undefined
          ? `${formattedWholePart},${decimalPart}`
          : formattedWholePart;

      event.target.value = formattedValue;
    });
  });
});

// Load data from local storage on page load
document.addEventListener("DOMContentLoaded", function () {
  const storedData = JSON.parse(localStorage.getItem("transactionData"));

  if (storedData) {
    // Restore previous data
    currentBudget = storedData.currentBudget;
    receipts = storedData.receipts;
    expenses = storedData.expenses;
    budget.innerHTML = `$ ${currentBudget.toLocaleString("en-US")}`;

    // Create transaction details in the HTML
    for (const transaction of storedData.transactions) {
      transactionDivider.insertAdjacentHTML(
        "afterbegin",
        transaction.htmlContent
      );
    }

    // Update the doughnut chart
    createDoughnutChart("myDoughnutChart", receipts, expenses);

    // Update the budget color after adding the transaction
    updateBudgetColor();
  }
});

// Function calls
getMonthAndYear();

// Modules
// Call the function to create the chart
createDoughnutChart("myDoughnutChart", receipts, expenses);
=======
"use strict";
import { createDoughnutChart } from "./chart.js";

// Selected elements
const mainDate = document.querySelector(".date");
const transactionType = document.getElementById("type");
const addTransactionBtn = document.getElementById("btn");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const transactionDivider = document.querySelector(".transaction-divider");
const budget = document.querySelector(".money");

// Global variables
let currentBudget = 0;
let receipts = 0;
let expenses = 0;
let timeAndDate;

// Exports
export default currentBudget;

// Functions
// Get current month name and year
const getMonthAndYear = function () {
  const dateNow = new Date();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = dateNow.getMonth();
  const year = dateNow.getFullYear();
  const monthName = monthNames[month];
  return (mainDate.innerHTML = `${monthName} ${year}`);
};

// Get transaction type selection
const getTransactionType = function () {
  const selectedOption = transactionType.options[transactionType.selectedIndex];
  const selectedValue = selectedOption.value;
  return selectedValue;
};

// Get input field values
const getDescriptionValue = function () {
  const descriptionValue = descriptionInput.value;
  return descriptionValue;
};

const getAmountValue = function () {
  const amountValue = amountInput.value;
  return amountValue;
};

// Clear inputs fields
const clearInputs = function () {
  //Set select to default
  transactionType.value = transactionType.options[0].value;
  // Clear description and value
  descriptionInput.value = "";
  amountInput.value = "";
};

// Update budget sum based on transactions
const updateBudget = function (optionSelected, moneyAmount) {
  // Update current budget
  optionSelected === "revenue"
    ? (currentBudget += moneyAmount)
    : (currentBudget -= moneyAmount);
  budget.innerHTML = `$ ${currentBudget.toLocaleString("en-US")}`;
};

const updateBudgetColor = function () {
  budget.style.color = currentBudget >= 0 ? "#66a80f" : "#e03131";
};

// Update budget sum based on transactions
const updateReceiptsAndExpenses = function (optionSelected, moneyAmount) {
  // Update current budget
  optionSelected === "revenue"
    ? (receipts += moneyAmount)
    : (expenses += moneyAmount);
};

const getTimeAndDate = function () {
  // Current time and date
  const currentTime = new Date();
  const hour = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const day = currentTime.getDate();
  const month = currentTime.getMonth() + 1;
  const year = currentTime.getFullYear();
  timeAndDate = {
    hour: hour,
    minutes: minutes,
    day: day,
    month: month,
    year: year,
  };
  return timeAndDate;
};

// Function to save transaction data to local storage
const saveTransactionData = function (transactionData) {
  localStorage.setItem("transactionData", JSON.stringify(transactionData));
};

//Event Listeners
// Event listener on the add  value button to choose the type of the trasaction
addTransactionBtn.addEventListener("click", function () {
  const description = getDescriptionValue();
  const amount = getAmountValue().replace(/[^\d.]/g, "");
  const selected = getTransactionType();
  const dateAndTime = getTimeAndDate();

  if (amount > 5000000 || amount < -5000000) {
    return alert("We only accept values up to $ 5,000.000, you're too rich!");
  } else if (selected && description && amount) {
    const parsedAmount = parseFloat(amount.replace(/,/g, ""));

    const htmlContent = `
      <div class="transaction-details">
        <div class="transaction-timing">
          <span class="transaction-date">Date: ${String(
            dateAndTime.day
          ).padStart(2, "0")}/${String(dateAndTime.month).padStart(2, "0")}/${
      dateAndTime.year
    }</span>
          <span class="transaction-time">Time: ${String(
            dateAndTime.hour
          ).padStart(2, "0")}:${String(dateAndTime.minutes).padStart(
      2,
      "0"
    )}</span>
        </div>
        <span class="transaction-description">${
          description[0].toUpperCase() + description.split("").slice(1).join("")
        }</span>
      </div>
      <div class="transaction-value">
        <span class="transaction-amount ${
          selected === "revenue" ? "revenue" : "expense"
        }">$ ${parsedAmount.toLocaleString("en-US")}</span>
      </div>
    `;

    transactionDivider.insertAdjacentHTML("afterbegin", htmlContent);

    clearInputs();
    updateBudget(selected, parsedAmount);
    updateBudgetColor();
    updateReceiptsAndExpenses(selected, parsedAmount);

    // Update local storage
    const transactionData = {
      currentBudget,
      receipts,
      expenses,
      transactions: [
        { htmlContent, selected, parsedAmount, dateAndTime, description },
        ...(localStorage.getItem("transactionData")
          ? JSON.parse(localStorage.getItem("transactionData")).transactions
          : []),
      ],
    };

    saveTransactionData(transactionData);

    // Update the doughnut chart after storing the data
    createDoughnutChart("myDoughnutChart", receipts, expenses);
  } else {
    return alert(
      "Please select an option and provide values in both input areas."
    );
  }
});

// Event listener in the HTML document so the amount typed in the input area gets formatted as the user type so 1000 becomes 1,000 and so on
document.addEventListener("DOMContentLoaded", function () {
  const amountInput = document.getElementById("amount");

  amountInput.addEventListener("input", function (event) {
    setTimeout(() => {
      const inputValue = event.target.value;
      const parts = inputValue.split(".");
      const wholePart = parts[0].replace(/\D/g, "");
      const decimalPart = parts[1];

      const formattedWholePart = new Intl.NumberFormat("en-EN").format(
        wholePart
      );
      const formattedValue =
        decimalPart !== undefined
          ? `${formattedWholePart},${decimalPart}`
          : formattedWholePart;

      event.target.value = formattedValue;
    });
  });
});

// Load data from local storage on page load
document.addEventListener("DOMContentLoaded", function () {
  const storedData = JSON.parse(localStorage.getItem("transactionData"));

  if (storedData) {
    // Restore previous data
    currentBudget = storedData.currentBudget;
    receipts = storedData.receipts;
    expenses = storedData.expenses;
    budget.innerHTML = `$ ${currentBudget.toLocaleString("en-US")}`;

    // Create transaction details in the HTML
    for (const transaction of storedData.transactions) {
      transactionDivider.insertAdjacentHTML(
        "afterbegin",
        transaction.htmlContent
      );
    }

    // Update the doughnut chart
    createDoughnutChart("myDoughnutChart", receipts, expenses);

    // Update the budget color after adding the transaction
    updateBudgetColor();
  }
});

// Function calls
getMonthAndYear();

// Modules
// Call the function to create the chart
createDoughnutChart("myDoughnutChart", receipts, expenses);
>>>>>>> a0bc7cb35f99dbeb96e4e533e7e23cbed8c68b88
