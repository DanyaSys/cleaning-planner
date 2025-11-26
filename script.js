function addTask() {
    // ... существующий код ...
    
    const newTask = {
        id: Date.now(),
        title: title,
        category: category,
        priority: priority,
        type: type,
        completed: false,
        createdAt: new Date().toISOString(),
        // НОВЫЕ ПОЛЯ:
        hasReminder: document.getElementById('reminderToggle').checked,
        reminderDate: type === 'Разовая' ? document.getElementById('reminderDate').value : null,
        reminderInterval: type === 'Регулярная' ? document.getElementById('reminderInterval').value : null
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
}
