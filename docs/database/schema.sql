-- НОРМАЛИЗОВАННАЯ СХЕМА ДО 3NF ДЛЯ SQLite
-- Умный планировщик уборки - База данных
-- Создан: [Дата]
-- Версия: 1.0

-- 1. Пользователи системы
CREATE TABLE Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    created_at TEXT DEFAULT (datetime('now')),
    notification_enabled BOOLEAN DEFAULT 1,
    theme TEXT DEFAULT 'light' CHECK(theme IN ('light', 'dark'))
);

-- 2. Категории уборки (кухня, ванная и т.д.)
CREATE TABLE Categories (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT DEFAULT '#4CAF50',
    created_at TEXT DEFAULT (datetime('now'))
);

-- 3. Проекты/комнаты для группировки задач
CREATE TABLE Projects (
    project_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    user_id INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 4. Основные задачи уборки
CREATE TABLE Tasks (
    task_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    due_date TEXT,
    priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    task_type TEXT DEFAULT 'once' CHECK(task_type IN ('once', 'recurring')),
    recurrence_interval TEXT CHECK(recurrence_interval IN ('daily', 'weekly', 'biweekly', 'monthly')),
    reminder_time TEXT,
    estimated_duration INTEGER,
    location TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    completed_at TEXT,
    user_id INTEGER NOT NULL,
    project_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES Projects(project_id) ON DELETE SET NULL
);

-- 5. Связь многие-ко-многим между задачами и категориями
CREATE TABLE Task_Categories (
    task_id INTEGER,
    category_id INTEGER,
    assigned_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (task_id, category_id),
    FOREIGN KEY (task_id) REFERENCES Tasks(task_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id) ON DELETE CASCADE
);

-- 6. История выполненных задач (для статистики)
CREATE TABLE Task_History (
    history_id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER NOT NULL,
    completed_at TEXT NOT NULL,
    duration INTEGER,
    notes TEXT,
    FOREIGN KEY (task_id) REFERENCES Tasks(task_id) ON DELETE CASCADE
);

-- =================================================
-- ИНДЕКСЫ ДЛЯ ОПТИМИЗАЦИИ ЗАПРОСОВ
-- =================================================

-- Индексы для таблицы Tasks
CREATE INDEX idx_tasks_user_id ON Tasks(user_id);
CREATE INDEX idx_tasks_due_date ON Tasks(due_date);
CREATE INDEX idx_tasks_status ON Tasks(status);
CREATE INDEX idx_tasks_priority ON Tasks(priority);
CREATE INDEX idx_tasks_task_type ON Tasks(task_type);
CREATE INDEX idx_tasks_reminder_time ON Tasks(reminder_time);

-- Индексы для таблицы Projects
CREATE INDEX idx_projects_user_id ON Projects(user_id);

-- Индексы для таблицы Task_Categories
CREATE INDEX idx_task_categories_task_id ON Task_Categories(task_id);
CREATE INDEX idx_task_categories_category_id ON Task_Categories(category_id);

-- Индексы для таблицы Task_History
CREATE INDEX idx_task_history_task_id ON Task_History(task_id);
CREATE INDEX idx_task_history_completed_at ON Task_History(completed_at);

-- =================================================
-- ТРИГГЕРЫ ДЛЯ АВТОМАТИЧЕСКИХ ОБНОВЛЕНИЙ
-- =================================================

-- Триггер для автоматического обновления updated_at
CREATE TRIGGER update_task_timestamp 
AFTER UPDATE ON Tasks 
FOR EACH ROW 
BEGIN
    UPDATE Tasks SET updated_at = datetime('now') WHERE task_id = NEW.task_id;
END;

-- Триггер для создания записи в истории при завершении задачи
CREATE TRIGGER add_task_to_history 
AFTER UPDATE OF status ON Tasks 
FOR EACH ROW 
WHEN NEW.status = 'completed' AND OLD.status != 'completed'
BEGIN
    INSERT INTO Task_History (task_id, completed_at) 
    VALUES (NEW.task_id, datetime('now'));
END;

-- Триггер для автоматического создания следующей регулярной задачи
CREATE TRIGGER recreate_recurring_task 
AFTER UPDATE OF status ON Tasks 
FOR EACH ROW 
WHEN NEW.status = 'completed' AND OLD.status != 'completed' AND NEW.task_type = 'recurring'
BEGIN
    INSERT INTO Tasks (
        title, 
        description, 
        due_date,
        priority,
        task_type,
        recurrence_interval,
        reminder_time,
        user_id,
        project_id
    )
    SELECT 
        NEW.title,
        NEW.description,
        CASE NEW.recurrence_interval
            WHEN 'daily' THEN datetime(NEW.due_date, '+1 day')
            WHEN 'weekly' THEN datetime(NEW.due_date, '+7 days')
            WHEN 'biweekly' THEN datetime(NEW.due_date, '+14 days')
            WHEN 'monthly' THEN datetime(NEW.due_date, '+1 month')
            ELSE datetime(NEW.due_date, '+1 day')
        END,
        NEW.priority,
        'recurring',
        NEW.recurrence_interval,
        NEW.reminder_time,
        NEW.user_id,
        NEW.project_id;
END;
