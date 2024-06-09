document.addEventListener("DOMContentLoaded", () => {
  const viewApp = new BudgetView();
  viewApp.formOverview();
  viewApp.btnsFunctions();
});

//////logic of the budget app start/////

class expenseInfo {
  constructor(amount, description) {
    this.amount = amount;
    this.description = description;
  }
}

class BudgetApp {
  constructor() {
    this.budget = 0;
    this.balance = 0;
    this.expenses = [];
  }

  addBudget(amount) {
    this.budget += amount;
    this.balance += this.budget;
  }

  addExpense(amount, description) {
    const newExpense = new expenseInfo(amount, description);
    if (this.balance > amount) {
      this.balance -= amount;
      this.expenses.push(newExpense);
    } else {
      if (this.balance < amount) {
        alert(`Insuficient founds`);
      }
    }
  }

  updateExpenses() {
    let currentExpenses = 0;
    this.expenses.forEach((expense) => {
      currentExpenses += expense.amount;
    });
    return currentExpenses;
  }

  removeExpense(index) {
    this.balance += this.expenses[index].amount;
    this.expenses.splice(index, 1);
  }
}

//////logic of the budget app end

///// budget view start

class BudgetView {
  constructor() {
    this.app = document.getElementById("app");
    this.displayContainer = document.getElementById("display-container");
    this.budgetApp = new BudgetApp();
    this.lastClickedButtonId = null;
  }

  btnsFunctions() {
    document.getElementById("app").addEventListener("click", (e) => {
      const clickedBtn = e.target.id;
      if (this.lastClickedButtonId !== clickedBtn) {
        this.lastClickedButtonId = clickedBtn;
        if (e.target.id === "set-budget") {
          this.formOverview();
        } else if (e.target.id === "overview") {
          this.budgetOverview();
        } else if (e.target.id === "list-overview") {
          this.expenseList();
        }
      }
    });
  }

  budgetOverview() {
    this.displayContainer.innerHTML = "";
    /////create elements
    const fragment = document.createDocumentFragment();
    const h3 = document.createElement("h3");
    const budgetP = document.createElement("p");
    const expensesP = document.createElement("p");
    const balanceP = document.createElement("p");
    const prog = document.createElement("progress");
    /////// atributes and content
    h3.className = "app-display_sub";
    h3.textContent = "Budget Overview";
    budgetP.textContent = `Total Budget: $${this.budgetApp.budget}`;
    expensesP.textContent = `Total Expenses: $${this.budgetApp.updateExpenses()}`;
    balanceP.textContent = `Remaining Balance: $${this.budgetApp.balance}`;
    prog.setAttribute("value", `${this.budgetApp.balance}`);
    prog.setAttribute("max", `${this.budgetApp.budget}`);
    /////////append
    fragment.append(h3, budgetP, expensesP, balanceP, prog);
    this.displayContainer.appendChild(fragment);
  }

  formOverview() {
    this.displayContainer.innerHTML = "";
    // Crear elementos del formulario
    const fragment = document.createDocumentFragment();
    const formContainer = document.createElement("div");
    const formTitle = document.createElement("h2");
    const form = document.createElement("form");
    const budgetLabel = document.createElement("label");
    const budgetInput = document.createElement("input");
    const amountLabel = document.createElement("label");
    const amountInput = document.createElement("input");
    const descriptionLabel = document.createElement("label");
    const descriptionInput = document.createElement("input");
    const submitButton = document.createElement("button");
    const submitBudget = document.createElement("button");
    // atributes and content
    formContainer.className = "form-container";
    formTitle.textContent = "Add Budget and Expenses";
    form.setAttribute("id", "budget-form");

    budgetLabel.setAttribute("for", "budget");
    budgetLabel.textContent = "Budget:";
    budgetInput.setAttribute("type", "number");
    budgetInput.setAttribute("id", "budget");
    budgetInput.setAttribute("name", "budget");
    budgetInput.setAttribute("placeholder", "Enter your budget");
    budgetInput.setAttribute("required", true);
    submitBudget.setAttribute("type", "button");
    submitBudget.setAttribute("id", "addBudget");
    submitBudget.textContent = "Add Budget";

    amountLabel.setAttribute("for", "amount");
    amountLabel.textContent = "Expense Amount:";
    amountInput.setAttribute("type", "number");
    amountInput.setAttribute("id", "amount");
    amountInput.setAttribute("name", "amount");
    amountInput.setAttribute("placeholder", "Enter amount");
    amountInput.setAttribute("required", true);

    descriptionLabel.setAttribute("for", "description");
    descriptionLabel.textContent = "Expense Description:";
    descriptionInput.setAttribute("type", "text");
    descriptionInput.setAttribute("id", "description");
    descriptionInput.setAttribute("name", "description");
    descriptionInput.setAttribute("placeholder", "Enter description");
    descriptionInput.setAttribute("required", true);

    submitButton.setAttribute("type", "button");
    submitButton.setAttribute("id", "addBtn");
    submitButton.textContent = "Add Expense";
    // Append
    form.append(
      budgetLabel,
      budgetInput,
      submitBudget,
      amountLabel,
      amountInput,
      descriptionLabel,
      descriptionInput,
      submitButton
    );
    formContainer.append(formTitle, form);
    fragment.appendChild(formContainer);
    this.displayContainer.appendChild(fragment);
    this.formActions();
  }

  expenseList() {
    this.displayContainer.innerHTML = "";
    // Create elements
    const fragment = document.createDocumentFragment();
    const h3 = document.createElement("h3");
    const ul = document.createElement("ul");
    // Atributes and content
    h3.className = "app-display_sub";
    h3.textContent = "Expenses List";
    this.budgetApp.expenses.forEach((expense, index) => {
      const li = document.createElement("li");

      const amountSpan = document.createElement("span");
      amountSpan.className = "expense-amount";
      amountSpan.textContent = `$${expense.amount}`;

      const descSpan = document.createElement("span");
      descSpan.className = "expense-description";
      descSpan.textContent = expense.description;

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-expense";
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        this.budgetApp.removeExpense(index);
        this.expenseList();
      });

      li.append(amountSpan, descSpan, deleteButton);
      ul.appendChild(li);
    });
    // append
    fragment.append(h3, ul);
    this.displayContainer.appendChild(fragment);
  }

  formActions() {
    const budget = document.getElementById("budget");
    const expense = document.getElementById("amount");
    const description = document.getElementById("description");

    document.getElementById("addBudget").addEventListener("click", () => {
      if (this.budgetApp.budget == 0 && budget.value !== "") {
        this.budgetApp.addBudget(parseInt(budget.value));
        budget.value = "";
      } else {
        alert(`You already have a budget or you left the input empty`);
      }
    });

    document.getElementById("addBtn").addEventListener("click", () => {
      if (expense.value !== "" && description.value !== "") {
        this.budgetApp.addExpense(parseInt(expense.value), description.value);
        expense.value = "";
        description.value = "";
      } else {
        alert("Fill the inputs for amount and description");
      }
    });
  }
}
