//load spendinglist
let spendingList = [];
let savedSpending = window.localStorage.getItem("spendingList");

if (savedSpending !== null) {
    spendingList = JSON.parse(savedSpending);
}
//load the budget
let budget = 0;
let savedBudget = window.localStorage.getItem("budget");
if (savedBudget !== null) {
    budget = Number(savedBudget);
}
//load theme prefernece
let savedTheme = window.localStorage.getItem("theme");

//get today's date
let today = new Date();

window.onload = function () {
    //Home

    let totalSpending = document.getElementById("total-spending");
    let percentageBudget = document.getElementById("percentage-budget");

    if (totalSpending !== null && percentageBudget !== null) {
        if (spendingList.length === 0 && budget === 0) {
            //no budget no spending
            totalSpending.innerHTML = "$0";
            percentageBudget.innerHTML = "add a spending and set a budget to begin";
        } else if (budget === 0 && spendingList.length !== 0) {
            //has spending record but no budget
            totalSpending.innerHTML = "$" + getHomeTotalAmount(spendingList);
            percentageBudget.innerHTML = 'Go set a budget in "Manage" to see if you overspend.';
        } else if (budget !== 0 && spendingList.length === 0) {
            totalSpending.innerHTML = "$0";
            percentageBudget.innerHTML = "add a spending to begin";
        } else {
            //have both on file
            let totalAmount = getHomeTotalAmount(spendingList);
            let percentage = Math.floor((totalAmount / budget) * 100);
            totalSpending.innerHTML = "$" + totalAmount;
            percentageBudget.innerHTML =
                percentage + "% of your monthly budget. See Manage for details.";
        }
    }

    //Add
    let spendingForm = document.getElementById("spending");

    if (spendingForm !== null) {
        spendingForm.onsubmit = function (event) {
            event.preventDefault();
            addSpending();
            spendingForm.reset();
        };
    }

    //Manage
    let monthDisplay = document.getElementById("current-month");
    //check if user is on Manage tab
    if (monthDisplay !== null) {
        //budget section
        let budgetInput = document.getElementById("budget-input");
        let saveBudget = document.getElementById("save-budget");
        let budgetDisplay = document.getElementById("budget-display");
        let budgetConfirmationPrompt = document.getElementById("confirm-budget");
        monthDisplay.innerHTML = today.toLocaleString("en-US", { month: "long" }); //English month
        budgetDisplay.innerHTML = "$" + budget;
        saveBudget.onclick = function () {
            budget = Number(budgetInput.value);
            window.localStorage.setItem("budget", budget);
            budgetDisplay.innerHTML = "$" + budget.toFixed(2);
            budgetConfirmationPrompt.innerHTML = "Budget Saved!";
        };
        //spendings section
        renderManage();
    }

    //settings
    let clearDataButton = document.getElementById("clear-data");
    if (clearDataButton !== null) {
        clearDataButton.onclick = function () {
            if (window.confirm("Delete all saved spendings and budget?")) {
                localStorage.removeItem("spendingList");
                localStorage.removeItem("budget");
                //current variables, too
                spendingList = [];
                budget = 0;
            }
        };
    }
    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
    }
    let themeButton = document.getElementById("switch-theme");
    if (themeButton !== null) {
        themeButton.onclick = function () {
            if (document.body.classList.contains("dark-theme")) {
                document.body.classList.remove("dark-theme");
                window.localStorage.setItem("theme", "default");
            } else {
                document.body.classList.add("dark-theme");
                window.localStorage.setItem("theme", "dark");
            }
        };
    }
};

function addSpending() {
    let amount = document.getElementById("spending-amount");
    let category = document.getElementById("spending-category");
    let date = document.getElementById("spending-date");
    let note = document.getElementById("spending-note");
    let confirmation = document.getElementById("entry-confirm");

    let spendingEntry = {
        amount: Number(amount.value),
        category: category.value,
        date: date.value,
        note: note.value,
    }; //object

    spendingList.push(spendingEntry);
    //save localStorage, too
    window.localStorage.setItem("spendingList", JSON.stringify(spendingList));
    confirmation.innerHTML = "Spending saved in Manage!";
}

function renderManage() {
    let foodList = document.getElementById("food-list");
    let transportList = document.getElementById("transport-list");
    let housingList = document.getElementById("housing-list");
    let entertainmentList = document.getElementById("entertainment-list");
    let othersList = document.getElementById("others-list");
    //reset every call or else results will be duplicated
    transportList.value = "";
    foodList.value = "";
    housingList.value = "";
    entertainmentList.value = "";
    othersList.value = "";

    for (let i = 0; i < spendingList.length; i++) {
        let spending = spendingList[i];
        if (spending.category === "transport") {
            if (spending.note === "") {
                transportList.innerHTML +=
                    "<li>$" + spending.amount + "-" + spending.date + "</li>";
            } else {
                transportList.innerHTML +=
                    "<li>$" +
                    spending.amount +
                    "-" +
                    spending.date +
                    "<br>" +
                    spending.note +
                    "</li>";
            }
        } else if (spending.category === "food") {
            if (spending.note === "") {
                foodList.innerHTML += "<li>$" + spending.amount + "-" + spending.date + "</li>";
            } else {
                foodList.innerHTML +=
                    "<li>$" +
                    spending.amount +
                    "-" +
                    spending.date +
                    "<br>" +
                    spending.note +
                    "</li>";
            }
        } else if (spending.category === "housing") {
            if (spending.note === "") {
                housingList.innerHTML += "<li>$" + spending.amount + "-" + spending.date + "</li>";
            } else {
                housingList.innerHTML +=
                    "<li>$" +
                    spending.amount +
                    "-" +
                    spending.date +
                    "<br>" +
                    spending.note +
                    "</li>";
            }
        } else if (spending.category === "entertainment") {
            if (spending.note === "") {
                entertainmentList.innerHTML +=
                    "<li>$" + spending.amount + "-" + spending.date + "</li>";
            } else {
                entertainmentList.innerHTML +=
                    "<li>$" +
                    spending.amount +
                    "-" +
                    spending.date +
                    "<br>" +
                    spending.note +
                    "</li>";
            }
        } else if (spending.category === "others") {
            if (spending.note === "") {
                othersList.innerHTML += "<li>$" + spending.amount + "-" + spending.date + "</li>";
            } else {
                othersList.innerHTML +=
                    "<li>$" +
                    spending.amount +
                    "-" +
                    spending.date +
                    "<br>" +
                    spending.note +
                    "</li>";
            }
        } else {
            console.log("something wrong with renderManage!!!!");
        }
    }
}

function getHomeTotalAmount(list) {
    //very useful parameter......
    list = spendingList;
    let amount = 0;
    for (let i = 0; i < list.length; i++) {
        amount += spendingList[i].amount;
    }
    return amount;
}
