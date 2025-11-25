let tasks = JSON.parse(localStorage.getItem('cleaningTasks')) || [];

function saveTasks() {
    localStorage.setItem('cleaningTasks', JSON.stringify(tasks));
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const categorySelect = document.getElementById('categorySelect');
    const prioritySelect = document.getElementById('prioritySelect');
    const taskTypeSelect = document.getElementById('taskTypeSelect');
    
    const title = taskInput.value.trim();
    const category = categorySelect.value;
    const priority = prioritySelect.value;
    const type = taskTypeSelect.value;
    
    if (!title || !category) {
        alert('Пожалуйста, введите задачу и выберите категорию');
        return;
    }
    
    const newTask = {
        id: Date.now(),
        title: title,
        category: category,
        priority: priority,
        type: type,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    
    // Сброс формы
    taskInput.value = '';
    categorySelect.value = '';
    prioritySelect.value = 'Средний';
    taskTypeSelect.value = 'Разовая';
}

function completeTask(taskId) {
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasks();
    renderTasks();
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
}

function renderTasks() {
    const activeTaskList = document.getElementById('activeTaskList');
    const completedTaskList = document.getElementById('completedTaskList');
    
    activeTaskList.innerHTML = '';
    completedTaskList.innerHTML = '';
    
    tasks.forEach(task => {
        const taskElement = document.createElement('li');
        taskElement.className = `task-item ${task.priority.toLowerCase().replace('ий', '')}-priority`;
        
        taskElement.innerHTML = `
            <div class="task-content">
                <div class="task-title">${task.title}</div>
                <div class="task-meta">
                    <span>${task.category}</span>
                    <span>${task.priority} приоритет</span>
                    <span>${task.type}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="complete-btn" onclick="completeTask(${task.id})">
                    ${task.completed ? '❌' : '✅'}
                </button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">🗑️</button>
            </div>
        `;
        
        if (task.completed) {
            completedTaskList.appendChild(taskElement);
        } else {
            activeTaskList.appendChild(taskElement);
        }
    });
}

function filterTasks(filter) {
    renderTasks();
}
document.addEventListener('DOMContentLoaded', renderTasks);
