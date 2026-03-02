const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const efficiencyText = document.getElementById("efficiency");
const statusText = document.getElementById("statusText");
const progressBar = document.getElementById("progress");
const themeToggle = document.getElementById("themeToggle");
const filters = document.querySelectorAll(".filter");
const clearCompletedBtn = document.getElementById("clearCompleted");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

/* Render single task */
function renderTask(task, index) {
  const li = document.createElement("li");
  li.className = "task" + (task.completed ? " completed" : "");
  li.tabIndex = 0;

  li.innerHTML = `
    <span>${task.text}</span>
    <button aria-label="Delete task">✕</button>
  `;

  li.querySelector("span").addEventListener("click", () => {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
  });

  li.querySelector("button").addEventListener("click", () => {
    tasks.splice(index, 1);
    saveTasks();
  });

  return li;
}

/* Render tasks */
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    if (currentFilter === "active" && task.completed) return;
    if (currentFilter === "completed" && !task.completed) return;

    taskList.appendChild(renderTask(task, index));
  });

  updateStats();
}

/* Update efficiency and status */
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  efficiencyText.textContent = `${percent}%`;
  statusText.textContent = `${completed} of ${total} Tasks Done`;
  progressBar.style.width = `${percent}%`;
}

/* Save to localStorage */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

/* Add task */
taskInput.addEventListener("keydown", e => {
  if (e.key === "Enter" && taskInput.value.trim() !== "") {
    tasks.push({ text: taskInput.value, completed: false });
    taskInput.value = "";
    saveTasks();
  }
});

/* Filters */
filters.forEach(btn => {
  btn.addEventListener("click", () => {
    filters.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

/* Clear completed */
clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
});

/* Theme toggle */
function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

themeToggle.addEventListener("click", toggleTheme);

/* Load theme */
if (
  localStorage.getItem("theme") === "dark" ||
  (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.body.classList.add("dark");
}

/* Keyboard delete */
document.addEventListener("keydown", e => {
  if (e.key === "Delete") {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
  }
});

/* Initial render */
renderTasks();