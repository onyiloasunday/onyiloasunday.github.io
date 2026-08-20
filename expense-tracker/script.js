const form = document.getElementById('expense-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const filterSelect = document.getElementById('filter');
const expenseList = document.getElementById('expense-list');
const totalDisplay = document.getElementById('total');

const HIGH_SPEND_THRESHOLD = 5000;

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

renderAll();

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const expense = {
    id: Date.now(),
    description: descriptionInput.value,
    amount: parseFloat(amountInput.value),
    category: categoryInput.value,
    date: new Date().toLocaleDateString()
  };

  expenses.push(expense);
  saveToLocalStorage();
  renderAll();
  form.reset();
});

filterSelect.addEventListener('change', renderAll);

function renderAll() {
  expenseList.innerHTML = '';
  const filterValue = filterSelect.value;

  const filtered = filterValue === 'All'
    ? expenses
    : expenses.filter(exp => exp.category === filterValue);

  const grouped = groupByDate(filtered);
  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  sortedDates.forEach(date => {
    renderDateGroup(date, grouped[date]);
  });

  updateTotal(filtered);
}

function groupByDate(list) {
  return list.reduce((groups, exp) => {
    if (!groups[exp.date]) groups[exp.date] = [];
    groups[exp.date].push(exp);
    return groups;
  }, {});
}

function renderDateGroup(date, dayExpenses) {
  const dayTotal = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const header = document.createElement('li');
  header.className = 'date-header';
  header.innerHTML = `<span>${date}</span><span>Daily: ₦${dayTotal}</span>`;
  expenseList.appendChild(header);

  dayExpenses.forEach(renderExpense);
}

function renderExpense(expense) {
  const li = document.createElement('li');
  const isHigh = expense.amount >= HIGH_SPEND_THRESHOLD;

  li.innerHTML = `
    <div class="top-row">
      <span>${expense.description}</span>
      <span class="${isHigh ? 'high-spend' : ''}">₦${expense.amount}</span>
    </div>
    <div class="meta">${expense.category}</div>
  `;
  expenseList.appendChild(li);
}

function updateTotal(list) {
  const total = list.reduce((sum, exp) => sum + exp.amount, 0);
  totalDisplay.textContent = `₦${total}`;
}

function saveToLocalStorage() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
                      }
