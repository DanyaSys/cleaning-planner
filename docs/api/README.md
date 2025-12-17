# CleaningPlanner API Documentation
# 🧹 Умный планировщик уборки
## API для управления задачами по уборке помещений с поддержкой категорий (комнат) и пользовательской аутентификации.
## 🔗 Mock Server URL
`https://be02313f-00dc-4f0c-8d0f-2bb0fa5080b8.mock.pstmn.io`
## Endpoints
### Authentication
- `POST /auth/login?username=danya` - авторизация пользователя
### CleaningTasks Management
- `GET /cleaning_tasks?status=pending` - получить все задачи по уборке
- `POST /cleaning_tasks` - создать задачу по уборке
- `PATCH /cleaning_tasks?id=3` - обновить задачу по уборке
- `DELETE /cleaning_tasks?id=3` - удалить задачу по уборке
### Categories
- `GET /rooms?include_archived=false` - получить по категории room информацию
- `POST /rooms` - создать комнату для категории
## Examples
### 📁  Login user
- `Name: Success - Login user` URL: {{base_url}}/auth/login?username=danya
- <img width="1371" height="732" alt="image" src="https://github.com/user-attachments/assets/2de7db90-3da9-407c-958c-edff16aeebbe" />

- `Error - Invalid credentials` URL: {{base_url}}/auth/login?username=daniil
### 📁  Get All Tasks
- `Name: Success - With cleaning tasks` URL: {{base_url}}/cleaning_tasks?status=pending
- <img width="1369" height="861" alt="image" src="https://github.com/user-attachments/assets/57a5a018-8bf8-42c7-9d4c-3c2c19ac5264" />

- `Name: Success - No tasks` URL: {{base_url}}/cleaning_tasks?status=completed
- `Name: Error - Invalid status` URL: {{base_url}}/cleaning_tasks?status=unknown
- `Name: Error - Unauthorized` URL: {{base_url}}/cleaning_tasks
### 📁  Create Cleaning Task
- `Name: Success - Task created` URL: {{base_url}}/cleaning_tasks
- <img width="1358" height="637" alt="image" src="https://github.com/user-attachments/assets/eaac997c-43b8-4cd4-aa24-197855d2696e" />

- `Name: Error - Validation failed` URL: {{base_url}}/cleaning_tasks?title
- `Name: Error - Room not found` URL: {{base_url}}/cleaning_tasks?room_id=999
### 📁  Update Cleaning Task
- `Name: Success - Task updated` URL: {{base_url}}/cleaning_tasks?id=3
- <img width="1374" height="583" alt="image" src="https://github.com/user-attachments/assets/ea7b8d82-4dcc-43eb-88b4-cc6adaab41f8" />

- `Name: Error - Task not found` URL: {{base_url}}/cleaning_tasks?id=666
- `Name: Error - Invalid status value` URL: {{base_url}}/cleaning_tasks?status=archived
### 📁  Delete Cleaning Task
- `Name: Success - Task deleted` URL: {{base_url}}/cleaning_tasks?id=3
- <img width="1347" height="534" alt="image" src="https://github.com/user-attachments/assets/04cd2d6b-eb9e-4e3d-ab01-0a7faf9fdf41" />

- `Name: Error - Task not found` URL: {{base_url}}/cleaning_tasks?id=555
### 📁  Get Rooms
- `Name: Success - Rooms list` URL: {{base_url}}/rooms?include_archived=false
- <img width="1365" height="857" alt="image" src="https://github.com/user-attachments/assets/0cca5b4d-8c09-47e7-87de-b126796c1ea5" />

- `Name: Error - Invalid parameter` URL: {{base_url}}/rooms?include_archived=yes
### 📁  Create Room
- `Name: Create Room` URL: {{base_url}}/rooms
- <img width="1369" height="599" alt="image" src="https://github.com/user-attachments/assets/a7115b45-1075-40ba-8537-6f00bfb9a7b1" />

- `Name: Error - Room already exists` URL: {{base_url}}/rooms?name="Кухня"
## 📝 Tests
- <img width="706" height="451" alt="image" src="https://github.com/user-attachments/assets/c2721a30-7084-4250-b615-0ae9b1e70fb8" />
- и т.д.
