В базі данних вже є зареєстровані 3 користувача:

Адмін - email(some@gmail.com), password(qwertyqwerty)
Босс - email(som@gmail.com), password(qwertyqwerty)
Користувач - email(somі@gmail.com), password(qwertyqwerty)

Ендпоінти:
Реєстрація:
POST - http://localhost:4000/register - приймає: name, email, password, isBoss
Авторизація:
POST - http://localhost:4000/login - приймає:  email, password

Отримання списку користувачів:
GET - http://localhost:4000/list - приймає: token
Босс добавляє підлеглих:
POST - http://localhost:4000/list/add - приймає: token, email, position
Босс змінює підлеглого на свого Босса:
POST - http://localhost:4000/list/edit - приймає: token, email
