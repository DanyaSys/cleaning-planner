let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = 'all';

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
    const input = document.getElementById('taskInput');
    const category = document.getElementById('category');
    const text = input.value.trim();
    
    if (text === '') return;
    
    tasks.push({
        id: Date.now(),
        text: text,
        category: category.value,
        done: false
    });
    
    input.value = '';
    renderTasks();
    saveTasks();
}

function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? {...task, done: !task.done} : task
    );
    renderTasks();
    saveTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
    saveTasks();
}

function showAll() { filter = 'all'; renderTasks(); }
function showActive() { filter = 'active'; renderTasks(); }
function showCompleted() { filter = 'completed'; renderTasks(); }

function renderTasks() {
    const list = document.getElementById('taskList');
    let filteredTasks = tasks;
    
    if (filter === 'active') filteredTasks = tasks.filter(t => !t.done);
    if (filter === 'completed') filteredTasks = tasks.filter(t => t.done);
    
    list.innerHTML = filteredTasks.map(task => `
        <li class="task ${task.done ? 'done' : ''}">
            <div>
                <strong>${task.text}</strong>
                <small>(${task.category})</small>
            </div>
            <div class="task-actions">
                <button onclick="toggleTask(${task.id})">
                    ${task.done ? '❌' : '✅'}
                </button>
                <button class="delete" onclick="deleteTask(${task.id})">🗑️</button>
            </div>
        </li>
    `).join('');
}

document.addEventListener('DOMContentLoaded', renderTasks);

document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addTask();
});
