let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = 'all';

if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function toggleReminder() {
    const reminderToggle = document.getElementById('reminderToggle');
    const reminderTime = document.getElementById('reminderTime');
    
    if (reminderToggle.checked) {
        reminderTime.classList.remove('hidden');
    } else {
        reminderTime.classList.add('hidden');
    }
}

function addTask() {
    const input = document.getElementById('taskInput');
    const category = document.getElementById('category');
    const reminderToggle = document.getElementById('reminderToggle');
    const reminderTime = document.getElementById('reminderTime');
    
    const text = input.value.trim();
    if (text === '') return;
    
    const newTask = {
        id: Date.now(),
        text: text,
        category: category.value,
        done: false,
        // НОВОЕ: Данные напоминания
        hasReminder: reminderToggle.checked,
        reminderMinutes: reminderToggle.checked ? parseInt(reminderTime.value) : null,
        reminderShown: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    
    input.value = '';
    reminderToggle.checked = false;
    reminderTime.classList.add('hidden');
    
    renderTasks();
    saveTasks();
    showNotification('Задача добавлена!');
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
    showNotification('Задача удалена');
}

function showAll() { filter = 'all'; renderTasks(); }
function showActive() { filter = 'active'; renderTasks(); }
function showCompleted() { filter = 'completed'; renderTasks(); }
function showWithReminders() { filter = 'reminders'; renderTasks(); }

function renderTasks() {
    const list = document.getElementById('taskList');
    let filteredTasks = tasks;
    
    if (filter === 'active') filteredTasks = tasks.filter(t => !t.done);
    if (filter === 'completed') filteredTasks = tasks.filter(t => t.done);
    if (filter === 'reminders') filteredTasks = tasks.filter(t => t.hasReminder && !t.done);
    
    list.innerHTML = filteredTasks.map(task => `
        <li class="task ${task.done ? 'done' : ''} ${task.hasReminder ? 'with-reminder' : ''}">
            <div>
                <strong>${task.text}</strong>
                <small>(${task.category})</small>
                ${task.hasReminder && !task.done ? '<span class="reminder-badge">🔔</span>' : ''}
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

function checkReminders() {
    const now = new Date();
    
    tasks.forEach(task => {
        if (task.hasReminder && !task.done && !task.reminderShown) {
            const taskTime = new Date(task.createdAt);
            const reminderTime = new Date(taskTime.getTime() + task.reminderMinutes * 60000);
            
            if (now >= reminderTime) {
                showBrowserNotification(task);
                task.reminderShown = true;
                saveTasks();
                renderTasks();
            }
        }
    });
}

function showBrowserNotification(task) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🔔 Напоминание о уборке', {
            body: `Пора выполнить: ${task.text} (${task.category})`,
            icon: '/icon.png'
        });
    }
    
    showNotification(`🔔 Пора: ${task.text}`);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    renderTasks();
    setInterval(checkReminders, 60000);
    
    setTimeout(checkReminders, 1000);
});


document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addTask();
});
