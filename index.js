const WORKDAYS = 260;
let weeksPerYear = 52;
var hrsPerDay;
var daysPerWeek;
var salary;
var hourly;
var project;
var projectTime;
var vacation;
var fees;
var sickTime;
var adminTime;
var taxRate;
var subs;
var weeksOff;
var daysOfWork;
var totalWorkDays;
var totalHoursAvailable;
let resetButton;
var mPmt;
var sala;
var cellPhone;
var salaryLessExpense;
var vacation;
var holidays;
var sickDays;
var salaryLessDays;
var salaryLessHolidays;
var salaryLessSick;
let page = 1;
var licenses;
var totalExpenses;
let test = {};
let userSalary = weeksPerYear;

/*
    refactoring: 
    Create this so the vairables are not globally accessible
        - Call variable parameters in each function as needed
        - Make Variables within each, calling and establishing as neccessary
        - Hold vriables in separate file and import
        - Create a class for reference?
*/

window.onload = function () {
  document.getElementById("page1").style.display = "block";
  document.getElementById("salary").focus();
  document.getElementById("sbt").onclick = populateInputs;
  document.getElementById("rst").onclick = resetForm;
  document.getElementById("add").onclick = addLineItem;
  document.getElementById("remove").onclick = removeLineItem;
  populateInputsWithPages();
};

function populateInputsWithPages() {
  let pages = document.getElementsByClassName("page");

  for (let i = 0; i < pages.length; i++) {
    test[pages[i].id] = {};
    populateInputHash(pages[i], test[pages[i].id]);
  }
}

function populateInputHash(page, pageHash) {
  let allInputs = page.getElementsByTagName("input");

  for (let i = 0; i < allInputs.length; i++) {
    if (allInputs[i].previousElementSibling && allInputs[i].type === "number") {
      pageHash[allInputs[i].id] = "";
    }
  }
}

function incrementPage() {
  let currentPage = document.getElementById(`page${page}`);
  page += 1;
  currentPage = document.getElementById(`page${page}`);

  if (currentPage) {
    currentPage.style.display = "block";
  }
}

function addExpenses(totalExpenses) {
  let costs = document.getElementsByClassName("additionalExpenses");

  for (let i = 0; i < costs.length; i++) {
    totalExpenses += Number(costs[i].value);
  }

  return totalExpenses;
}

let additionalCount = 1;
function addLineItem() {
  let inputName = document.createElement("input");
  let inputCost = document.createElement("input");
  let spacer = document.createElement("br");

  inputName.type = "text";
  inputName.defaultValue = "Name Of Expense";

  inputCost.type = "number";
  inputCost.className = "additionalExpenses";
  inputCost.id = `additionalInput${additionalCount}`;
  test[`page${page}`][inputCost.id] = "";
  additionalCount += 1;

  let newLineItem = document.getElementById("add").previousElementSibling;
  newLineItem.insertAdjacentElement("afterend", spacer);
  newLineItem.insertAdjacentElement("afterend", inputCost);
  newLineItem.insertAdjacentElement("afterend", inputName);
}

//have to remove from TEST {} also
function removeLineItem() {
  let lastItem = document.getElementById("add").previousElementSibling;
  let otherLast = lastItem.previousElementSibling;
  let lastOne = otherLast.previousElementSibling;
  removeFromHash(otherLast.id);
  lastItem.remove();
  otherLast.remove();
  lastOne.remove();
}

function removeFromHash(key) {
  delete test["page6"][key];
}

function checkInputs() {
  let allInputs = [];
  salary = document.getElementById("salary");

  //this loop iterates through pages of the hash table and its content to ensure
  //values are filled out prior to allowing the next page to display
  for (let i = 1; i <= page; i++) {
    let pageInputs = test[`page${i}`];
    let namesInTable = Object.keys(pageInputs);
    let valuesOfTable = Object.values(pageInputs);

    //this loop converts colors on the input borders
    for (let i = 0; i < namesInTable.length; i++) {
      let currentInput = document.getElementById(`${namesInTable[i]}`);
      valuesOfTable[i]
        ? (currentInput.style.borderColor = "green")
        : (currentInput.style.borderColor = "red");

      allInputs.push(currentInput);
    }
  }

  //tells users that something is wrong
  for (let j = 0; j < allInputs.length; j++) {
    if (allInputs[j].style.borderColor === "red") {
      alert("Please check your inputs.");
      salary.textContent = "Get You Numbers Right.";
      return null;
    }
  }

  adjustSalary(salary);
  incrementPage();
}

function populateInputs() {
  for (let pageCount = 1; pageCount <= page; pageCount++) {
    let pageInputs = test[`page${pageCount}`];
    let namesInTable = Object.keys(pageInputs);

    for (let i = 0; i < namesInTable.length; i++) {
      let currentInput = document.getElementById(`${namesInTable[i]}`);
      pageInputs[namesInTable[i]] = currentInput.value;
    }
  }

  checkInputs();
}

function adjustSalary(salary) {
  let hourly = test["page1"]["hourlyRate"];
  let hrsPerDay = test["page1"]["hrsPerDay"];
  let pageInputs = test[`page${page}`];
  let valuesOfTable = Object.values(pageInputs);

  if (page === 1) {
    valuesOfTable.forEach((input) => (userSalary *= Number(input)));
  }

  if (page === 2) {
    userSalary *= convertToPercent(valuesOfTable);
  }

  if (page > 2 && page < 6) {
    valuesOfTable = valuesOfTable.reduce((total, item) => {
      return total + item;
    }, 0);
    userSalary -= hourly * hrsPerDay * Number(valuesOfTable);
  }

  if (page === 6) {
    licenses = document.getElementById("software").value;
    subs = document.getElementById("subscriptions").value;
    cellPhone = document.getElementById("cellphone").value;
    totalExpenses = Number(licenses) + Number(subs) + Number(cellPhone);

    totalExpenses = addExpenses(totalExpenses) * 12;
    userSalary -= totalExpenses;
  }

  if (page === 7) {
    taxRate = document.getElementById("taxRate").value;
    taxRate = convertToPercent(taxRate);

    userSalary *= taxRate;
    monthlySalary.textContent = userSalary / 12;
    weeklySalary.textContent = userSalary / 52;
    dailySalary.textContent = userSalary / 365;
  }

  salary.textContent = userSalary;
}

function convertToPercent(fee) {
  return 1 - fee / 100;
}

function convertWeeksToDays(weeksVacation, daysPerWeek) {
  //value associated wiht their daysperweek input
  return weeksVacation * daysPerWeek;
}

function workDaysPerYear(sickTime, federal, weeksOff, daysPerWeek) {
  let weekend = DAYSINWEEK - daysPerWeek;
  let totalWeekendDays = weekend * WEEKSINYEAR;
  return DAYSINYEAR - (sickTime + federal + weeksOff + totalWeekendDays);
}

//rework the logic
function calculateHourly(salary, totalWorkDays, hrsPerDay) {
  return parseInt(salary) / (totalWorkDays * hrsPerDay);
}

function calculateWeekly(salary, totalWorkDays, daysPerWeek) {
  return salary / Math.floor(totalWorkDays / daysPerWeek);
}

function calculateMonthly(salary) {
  return salary / MONTHSINYEAR;
}

function resetForm() {
  resetVars();
  document.getElementById("page1").style.display = "block";
}

//reset the test with empty vars
function resetVars() {
  populateInputHash((test = {}));
  salary.textContent = "";
  page = 1;
  let pageReset = document.getElementsByClassName("page");

  for (let i = 0; i < pageReset.length; i++) {
    pageReset[i].style.display = "none";
  }
}
