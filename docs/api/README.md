# TaskManager API Documentation
## Mock Server URL
`https://your-mock-id.mock.pstmn.io`
## Endpoints
### Authentication
- `POST /auth/login` - авторизация пользователя
### Tasks
- `GET /tasks` - получить все задачи
- `POST /tasks` - создать задачу
- `PATCH /tasks/:id` - обновить задачу
- `DELETE /tasks/:id` - удалить задачу
### Categories
- `GET /categories` - получить категории
## Examples
### Login
Name: Success - Login
URL: {{base_url}}/auth/login?username=avsiny
Error - Invalid credentials
URL: {{base_url}}/auth/login?username=avsiny1
### Get All Tasks
...
...
