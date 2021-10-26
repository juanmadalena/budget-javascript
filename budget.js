const balanceEl = document.querySelector(".balance .balance-total");
const incomeTotalEl = document.querySelector(".income-total");
const outcomeTotalEl = document.querySelector(".outcome-total");
const incomeEl = document.querySelector("#income");
const expenseEl = document.querySelector("#expense");
const allEl = document.querySelector("#all");
const incomeList = document.querySelector("#income .list");
const expenseList = document.querySelector("#expense .list");
const allList = document.querySelector("#all .list");
const popupOutcomeBtn = document.querySelector("#popup-outcome-button");
const popupIncomeBtn = document.querySelector("#popup-income-button");
const popupIncome = document.getElementById('popup-income');
const popupExpense = document.getElementById('popup-outcome');
const closeExpensePopup = document.querySelector(".close-expense")
const closeIncomePopup = document.querySelector(".close-income")
const popupButton = document.querySelector(".popup-button")

//toggle menu
const expenseBtn = document.querySelector(".tab1");
const incomeBtn = document.querySelector(".tab2");
const allBtn = document.querySelector(".tab3");

//input
const addExpense = document.querySelector(".add-expense");
const expenseTitle = document.getElementById("expense-title-input");
const expenseAmount = document.getElementById("expense-amount-input");

const addIncome = document.querySelector(".add-income");
const incomeTitle = document.getElementById("income-title-input");
const incomeAmount = document.getElementById("income-amount-input");

//variable
let ENTRY_LIST = [];
let balance = 0, income = 0, outcome = 0;

const DELETE = "delete", EDIT = "edit";

//Check if there is a saved list
ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list")) || [];

updateUI();

//toggle menu functions
expenseBtn.addEventListener("click", function () {
    show(expenseEl);
    hide([incomeEl, allEl]);
    active(expenseBtn);
    inactive([incomeBtn, allBtn]);
    popupButton.style.backgroundColor = "rgb(252, 87, 87)"

})
incomeBtn.addEventListener("click", function () {
    show(incomeEl);
    hide([expenseEl, allEl]);
    active(incomeBtn);
    inactive([expenseBtn, allBtn]);
})
allBtn.addEventListener("click", function () {
    show(allEl);
    hide([incomeEl, expenseEl]);
    active(allBtn);
    inactive([incomeBtn, expenseBtn]);
})

incomeList.addEventListener("click", deleteOrEdit);
expenseList.addEventListener("click", deleteOrEdit);
allList.addEventListener("click", deleteOrEdit);

//popup

function removeClassOut(document, button) {
    setTimeout(() => {
        console.log('hola');
        document.classList.remove('popup-animation-out')
        button.classList.remove('button-animation-in')
    }, 1100);
}

popupIncomeBtn.addEventListener("click", function () {
    popupIncomeBtn.classList.remove('button-animation-in')
    popupIncome.classList.remove('popup-animation-out')
    popupIncome.classList.add('popup-animation-in')
    popupIncomeBtn.classList.add('button-animation-out')
})

popupOutcomeBtn.addEventListener("click", function () {
    popupOutcomeBtn.classList.remove('button-animation-in')
    popupExpense.classList.remove('popup-animation-out')
    popupExpense.classList.add('popup-animation-in')
    popupOutcomeBtn.classList.add('button-animation-out')
})

closeExpensePopup.addEventListener("click", function () {
    popupOutcomeBtn.classList.remove('button-animation-out')
    popupExpense.classList.remove('popup-animation-in')
    popupExpense.classList.add('popup-animation-out')
    popupOutcomeBtn.classList.add('button-animation-in')
    removeClassOut(popupExpense, popupOutcomeBtn)
})
closeIncomePopup.addEventListener("click", function () {
    popupIncomeBtn.classList.remove('button-animation-out')
    popupIncome.classList.remove('popup-animation-in')
    popupIncome.classList.add('popup-animation-out')
    popupIncomeBtn.classList.add('button-animation-in')
    removeClassOut(popupIncome, popupIncomeBtn)
})

// HELPERS



function deleteOrEdit(event) {
    const targetBtn = event.target;


    let entry = targetBtn.parentNode;
    entry = entry.parentNode



    if (targetBtn.id === 'DELETE') {
        deleteEntry(entry);
    }
}

function deleteEntry(entry) {
    let message = confirm('Are you sure?')
    if (message == true) {
        ENTRY_LIST.splice(entry.id, 1);
    }
    updateUI();
}

function editEntry(entry) {
    console.log(entry)
    let ENTRY = ENTRY_LIST[entry.id];

    if (ENTRY.type == "income") {
        incomeAmount.value = ENTRY.amount;
        incomeTitle.value = ENTRY.title;
    } else if (ENTRY.type == "expense") {
        expenseAmount.value = ENTRY.amount;
        expenseTitle.value = ENTRY.title;
    }

    deleteEntry(entry);
}

function updateChart(income, outcome) {
    const chart = document.querySelector(".line-expense")
    const chartIncome = document.querySelector(".line-income")

    let total = income

    let line = outcome * 100 / total;

    let lineIncome = 100 - line;

    chart.style.width = `${line}%`;
    chartIncome.style.width = `${lineIncome}%`;
}

function updateUI() {
    income = calculateTotal('income', ENTRY_LIST)
    outcome = calculateTotal('expense', ENTRY_LIST)
    balance = calculateBalance(income, outcome)

    let sign = (income >= outcome) ? "$" : "-$";

    if (sign === "-$") document.querySelector(".value").style.color = 'red';

    balance = Math.abs(balance)

    balanceEl.innerHTML = `<span class="sign">${sign}</span>${balance}`;
    outcomeTotalEl.innerHTML = `$${outcome}`
    incomeTotalEl.innerHTML = `$${income}`

    clearElement([expenseList, incomeList, allList])

    ENTRY_LIST.forEach((entry, index) => {
        if (entry.type == "expense") {
            showEntry(expenseList, entry.type, entry.title, entry.amount, entry.date, index)
        } else if (entry.type == "income") {
            showEntry(incomeList, entry.type, entry.title, entry.amount, entry.date, index)
        }
        showEntry(allList, entry.type, entry.title, entry.amount, entry.date, index)

    })
    updateChart(income, outcome)

    localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST))
}

function showEntry(list, type, title, amount, date, id) {

    const entry = `<li id="${id}" class="entry">
                        <div class="entry-container">
                            <div class="entry-type ${type}">
                                ${type === "expense" ? "<i class='fas fa-arrow-up'></i>" : "<i class='fas fa-arrow-down'></i>"}
                            </div>
                            <div class="entry-details">
                                <div class="date"><p class="date-details">${date.day} ${date.month}</p></div>
                                <div class="entry-title">${title}</div>
                            </div>
                            <div class="entry-amount">${type === 'expense' ? '-' : ''}<small>$</small>${amount}</div>
                            <div class="entry-button">
                                <i class="far fa-times-circle" id="DELETE"></i>
                            </div>
                        </div>
                    </li>`;

    const position = "afterbegin";

    list.insertAdjacentHTML(position, entry);
}

function clearElement(elements) {
    elements.forEach(element => {
        element.innerHTML = "";
    })
}

function calculateTotal(type, list) {
    let sum = 0;

    list.forEach(entry => {
        if (entry.type == type) {
            sum += entry.amount
        }
    })
    return sum;
}

function calculateBalance(income, outcome) {
    return income - outcome;
}

function clearInput(inputs) {
    inputs.forEach(input => {
        input.value = ""
        input.style.border = "none"
    })
}

function show(element) {
    element.classList.remove("hide");
}

function hide(elements) {
    elements.forEach(element => {
        element.classList.add("hide")
    })
}

function active(element) {
    element.classList.add("active");
}

function inactive(elements) {
    elements.forEach(element => {
        element.classList.remove("active");
    })
}


addExpense.addEventListener("click", function () {
    if (!expenseTitle.value) {
        expenseTitle.style.border = ' red solid 1px';
        return event.preventDefault();
    }
    if (expenseAmount.value < 0 || !expenseAmount.value) {
        expenseAmount.style.border = ' red solid 1px';
        return event.preventDefault();
    }
    const dateTime = new Date()

    const day = dateTime.getDate();
    let month = dateTime.toDateString().split(' ')
    month = month[1]
    const hour = dateTime.getHours();
    const minutes = dateTime.getMinutes();

    let expense = {
        type: 'expense',
        title: expenseTitle.value,
        amount: parseFloat(expenseAmount.value),
        date: {
            day: day,
            month: month,
            hour: hour,
            minutes: minutes
        }
    }
    ENTRY_LIST.push(expense)
    clearInput([expenseTitle, expenseAmount])
    updateUI()
})

addIncome.addEventListener("click", function () {
    if (!incomeTitle.value) {
        incomeTitle.style.border = 'red 1px solid';
        return event.preventDefault();
    }
    else {
        incomeTitle.style.border = 'none';
    }
    if (incomeAmount.value < 0 || !incomeAmount) {
        incomeAmount.style.border = 'solid 1px red';
        return event.preventDefault();
    }
    else {
        incomeAmount.style.border = 'none';
    }
    const dateTime = new Date()

    const day = dateTime.getDate();
    let month = dateTime.toDateString().split(' ')
    month = month[1];
    const hour = dateTime.getHours();
    const minutes = dateTime.getMinutes();

    let income = {
        type: 'income',
        title: incomeTitle.value,
        amount: parseFloat(incomeAmount.value),
        date: {
            day: day,
            month: month,
            hour: hour,
            minutes: minutes
        }
    }
    ENTRY_LIST.push(income)
    clearInput([incomeAmount, incomeTitle])
    updateUI()

})