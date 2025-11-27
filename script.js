let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = 'all';

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
    const input = document.getElementById('taskInput');
    const category = document.getElementById('category');
    const taskType = document.getElementById('taskType');
    
    const text = input.value.trim();
    if (text === '') return;
    
    tasks.push({
        id: Date.now(),
        text: text,
        category: category.value,
        type: taskType.value,
        done: false,
        createdAt: new Date().toISOString()
    });
    
    input.value = '';
    renderTasks();
    saveTasks();
}

function completeTask(id) {
    const task = tasks.find(t => t.id === id);
    
    if (task.type === 'recurring') {

        tasks.push({
            id: Date.now(),
            text: task.text,
            category: task.category,
            type: 'recurring',
            done: false,
            createdAt: new Date().toISOString()
        });
    }
    
    tasks = tasks.map(t => 
        t.id === id ? {...t, done: true} : t
    );
    
    renderTasks();
    saveTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
    saveTasks();
}

function showAll() { 
    filter = 'all'; 
    renderTasks(); 
}

function showRecurring() { 
    filter = 'recurring'; 
    renderTasks(); 
}

function renderTasks() {
    const list = document.getElementById('taskList');
    let filteredTasks = tasks;
    
    if (filter === 'recurring') {
        filteredTasks = tasks.filter(t => t.type === 'recurring' && !t.done);
    }
    //комментарий)))
    list.innerHTML = filteredTasks.map(task => `
        <li class="task ${task.done ? 'done' : ''} ${task.type === 'recurring' ? 'recurring' : ''}">
            <div>
                ${task.text}
                <small>(${task.category})</small>
                ${task.type === 'recurring' ? '<span class="recurring-badge"></span>' : ''}
            </div>
            <div class="task-actions">
                ${!task.done ? `
                    <button onclick="completeTask(${task.id})">✓</button>
                ` : ''}
                <button class="delete" onclick="deleteTask(${task.id})">✕</button>
            </div>
        </li>
    `).join('');
}

document.addEventListener('DOMContentLoaded', renderTasks);

document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addTask();
});
