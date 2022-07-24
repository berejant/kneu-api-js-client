# JS client for KNEU RESTful API Service

This JS Library provide programmatic user-friendly interface to work with [the KNEU RESTful API and OAuth 2.0](http://docs.kneu.apiary.io/).

JS-бібліотека забезпечує зручний програмний інтерфейс для роботи з [КНЕУ RESTful API та протоколом OAuth 2.0](http://docs.kneu.apiary.io/).
Бібліотека розрахована на роботу в браузері.
Для роботи бібліотеки потрібно отримати client_id, client_secret, а також повідомити перелік доменних імен пов'язаних з вашим додатком.
Доступ до API можливий лише з визначеного дозволенного переліку доменних імен.

## Встановлення

Додати бібліотеку до Вашого проекту за допомогою NPM або завантажити вихідний код пакету

    npm install kneu-api-client

підключити бібліотеку до Вашого веб-проекту
```html
   <script src="./kneuApiClient.js"></script>
```

## Ініціалізація

Для ініціалізації бібліотеки потрібен AccessToken, який був отрманний сервером через процедуру [Авторизації сервера](https://kneu.docs.apiary.io/#/introduction/o-auth-2-0/%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%B0%D1%86%D1%96%D1%8F-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0)
```javascript
    let api = new KneuApi('{ACCESS_TOKEN}');
```

У випадку використання разом з [РНР Бібліотекою](https://github.com/berejant/kneu-api), підключення може бути реалізовано у наступному порядку:
```javascript 
<?php
  api = Kneu\Api::createWithServerToken(client_id, client_secret);
?>
<script src="./kneuApiClient.js"></script>
<script>
    let api = new KneuApi('<?= await api.getAccessToken() ?>');
</script>
```

## Опис методів

## `getFaculties([object filters = {},] [[number offset = null,] number limit = null]): Promise<object[]>`
Отримати перелік факультетів
```javascript
await api.getFaculties();
await api.getFaculties(limit);
await api.getFaculties(offset, limit);

let facultiesListExample =
[
    {
      "id": 1,
            "name": "Економіки та управління"
    },
    ...
]

```

## `getDepartments([object filters = {},] [[number offset = null,] number limit = null]): Promise<object[]>`
Отримати перелік кафедр
Дозволяє отримати перелік кафедр. Надає перелік:
- всіх кафедр відсортованних за id.
- кафедр вибраного факультету `faculty_id` відсортованних за назвою.

Об'єкт Кафедра надається разом з даними по зв'язанному об'єкту Факультет.


```javascript
await api.getDepartments(); // all
await api.getDepartments({faculty_id: 999}); // by faculty id
await api.getDepartments(filters);
await api.getDepartments(filters, limit);
await api.getDepartments(filters, offset, limit);
await api.getDepartments(offset, limit);
await api.getDepartments(limit);

let departmentsListExample =
[
  {
    "id": 53,
    "faculty_id": 3,
    "name": "Адміністративного та фінансового права",
    "faculty": {
      "id": 3,
      "name": "Юридичний інститут"
    }
  },
  {
    "id": 57,
    "faculty_id": 3,
    "name": "Іноземних мов юридичного інституту",
    "faculty": {
      "id": 3,
      "name": "Юридичний інститут"
    }
  },
  ...
]

```

## `getTeachers([object filters = {},] [[number offset = null,] number limit = null]): Promise<object[]>`
Дозволяє отримати перелік викладачів. Надає перелік:
- всіх викладачів відсортаванних за id.
- викладачів певного факультету `faculty_id` або кафедри `department_id` в алфавітному порядку за прізвищем.
  Об'єкт викладач надається разом даними зв'язаних об'єктів Кафедра та Користувач (User).

Увага! Обєкт User є необов'язковий. Присутний лише в разі, коли викладач вже зар'єструвався на сайті.

Внутрішня реалізація метода автоматично робить потрібну кількисть запитів до сервера, щоб отримати повний список викладачів.

```javascript
await api.getTeachers(); // all teachers
await api.getTeachers({faculty_id: 999}); // by faculty
await api.getTeachers({department_id: 999}); // by department
await api.getTeachers(filters);
await api.getTeachers(filters, limit);
await api.getTeachers(filters, offset, limit);
await api.getTeachers(offset, limit);
await api.getTeachers(limit);

let teachersListExample =
[
  {
    "id": 1105,
    "department_id": 21,
    "name": "Іваненко Іван Іванович",
    "first_name": "Іван",
    "middle_name": "Іванович",
    "last_name": "Іваненко",
    "image_url": "https:\/\/kneu.edu.ua\/files\/teacher\/teacher_photo\/thumbnail_1113333.jpg",
    "user": {
      "id": 5019,
      "login": "example@gmail.com"
    },
    "department": {
      "id": 21,
      "faculty_id": 3,
      "name": "Цивільного та трудового права"
    }
  },
  ...
]
```
## `getSpecialties([object filters = {},] [[number offset = null,] number limit = null]): Promise<object[]>`
Дозволяє отримати перелік спеціальностей. Надає перелік:
- всіх спеціальностей сортованних за id
- спеціальностей певного факультету `faculty_id` сортованних за назвою.

Надається разом із даними зв'язаного об'єкту Факультет.
Внутрішня реалізація метода автоматично робить потрібну кількисть запитів до сервера, щоб отримати повний список спеціальностей.

```javascript
await api.getSpecialties(); // all specialties
await api.getSpecialties({faculty_id: 999}); // by faculty
await api.getSpecialties(filters);
await api.getSpecialties(filters, limit);
await api.getSpecialties(filters, offset, limit);
await api.getSpecialties(offset, limit);
await api.getSpecialties(limit);

let specialtiesListExample =
[
  {
    "id": 131,
    "faculty_id": 9,
    "code": "6701",
    "name": "Безпепека інформаційних і комунікаційних систем",
    "faculty": {
      "id": 9,
      "name": "Інститут інформаційних технологій в економіці"
    }
  },
  {
    "id": 173,
    "faculty_id": 9,
    "code": "6.051",
    "name": "Економіка",
    "faculty": {
      "id": 9,
      "name": "Інститут інформаційних технологій в економіці"
    }
  },
  ...
]
```

## `getGroups([object filters = {},] [[number offset = null,] number limit = null]): Promise<object[]>`
Дозволяє отримати перелік академічних груп. Надає перелік:
- всіх академічних груп відсортованних за id;
- академичніних груп певної спеціальності `specialty_id` або факультету `faculty_id` відсортованних за назвою спеціальності та назвою групи

Об'єкт група надається разом із зв'заним об'єктом спеціальність.

```javascript
await api.getGroups(); // all groups
await api.getGroups({faculty_id: 999}); // by faculty
await api.getGroups({specialty_id: 999}); // by specialty
await api.getGroups(filters);
await api.getGroups(filters, limit);
await api.getGroups(filters, offset, limit);
await api.getGroups(offset, limit);
await api.getGroups(limit);

let groupsListExample =
[
  {
    "id": 13293,
    "specialty_id": 33,
    "course": 2,
    "name": "ПР.-201",
    "specialty": {
      "id": 33,
      "faculty_id": 18,
      "code": "7.03040101",
      "name": "Правознавство"
    }
  },
  {
    "id": 13297,
    "specialty_id": 36,
    "course": 2,
    "name": "ОА.-201",
    "specialty": {
      "id": 36,
      "faculty_id": 18,
      "code": "7.03050901",
      "name": "Облік і аудит"
    }
  },
  ...
]
```

## `getStudents([object filters = {},] [[number offset = null,] number limit = null]): Promise<object[]>`
Дозволяє отримати перелік студентів. Надає перелік:
- всіх студентів, відсортованних за id
- студентів певної академічної групи `group_id` підсортованих в алфавітному порядку за прізвищем

Якщо студент зарєстрованний на сайті, додатково до додається інформацію про звязанну сутність користувач (User).
Якщо студент не зарєстрованний на сайті - інформація про User відсутня у результаті.
Внутрішня реалізація метода автоматично робить потрібну кількисть запитів до сервера, щоб отримати повний список груп.

```javascript
await api.getStudents(); // all students
await api.getStudents({group_id: 999}); // by group and order by name 
await api.getStudents(filters);
await api.getStudents(filters, limit);
await api.getStudents(filters, offset, limit);
await api.getStudents(offset, limit);
await api.getStudents(limit);

let studentsListExample =
[
  {
    "id": 444,
    "group_id": 123,
    "gradebook_id": "999999",
    "sex": "male",
    "name": "Іваненко Павло Володимирович",
    "first_name": "Павло",
    "middle_name": "Володимирович",
    "last_name": "Іваненко",
    "birthdate": "1992-07-13",
    "user": {
      "id": 32664,
      "login": "example@gmail.com"
    }
  },
  ...
]
```

* **Parameters:**
    * `filters` — `object` — фільтр для вибірки певних об'єктів
    * `offset` — `integer` — зсув об'єктів у видачі. Аналог SQL LIMIT [offset], [limit];
    * `limit` — `number` — кількість об'єктів у видачі (MAX = 2000). Аналог SQL LIMIT [offset], [limit];
* **Returns:** `array`
* **Throws:**
    * `Error`

## `getFaculty(integer id): Promise<object>`
Отримати факультет зі вказаним id

## `getDepartment(integer id): Promise<object>`
Отримати кафедру зі вказаним id

## `getTeacher(integer id): Promise<object>`
Отримати викладача зі вказаним id

## `getSpecialty(integer id): Promise<object>`
Отримати спеціальність зі вказаним id

## `getGroup(integer id): Promise<object>`
Отримати групу зі вказаним id

## `getStudent(integer id): Promise<object>`
Отримати студента зі вказаним id


## `getContentRange(key)`

Дозволяє отримати Meta-інформацію про загальну кількість об'єктів певної сутності (для переліку викладачів, спеціальностей, факультетів тощо).
Інформація надається із заголовку Content-Range, тому метод `getContentRange()` може надати інформацію лише після виконання методу (запиту) на отримання переліку об'єктів певної сутності.
Наприклад, метод `getContentRange()` доцільно викликати після виконання методів `getTeachers()`, `getGroups()`, `getSpecialities()` тощо.
Детальніше застосування методу `getContentRange()` подано в прикладі коду нижче (у розділі [**Авторизація серверу та імпорт бази даних**](#Авторизація-серверу-та-імпорт-бази-даних)).

* **Parameters:** `key` — `string` — enum("total", "start", "end")
    * **total** - загальна кількість об'єктів (total count from database)
    * **start** - початок зсуву даних починаючи під початку (від 0). Аналог SQL LIMIT [start], 100. Іншими словам - індексу першого об'єкту з останнього запиту в загальному переліку об'єктів.
    * **end** - кінець зсуву даних. [end] = [start] + [limit] - 1 за аналогією з SQL LIMIT [start], [limit]. Іншими словам - індексу останнього об'єкту з останнього запиту в загальному переліку об'єктів.
    * Якщо значення `key` не задано, то метод поверне масив з ключами **start**, **end**, **total**.
* **Returns:** `array|integer|null`

## Приклад використання

### Авторизація серверу та імпорт даних

```javascript
let api = new KneuApi('{ACCESS_TOKEN}');

try {
    for (let teacher of await api.getTeachers()) {
        console.log(teacher);
    }

    for (let teacher of await api.getTeachers({department_id: 21})) {
        console.log(teacher);
    }

    for (let teacher of await api.getTeachers({faculty_id: 3})) {
        console.log(teacher);
    }

    for (let department of await api.getDepartments({faculty_id: 3})) {
        console.log(department);
    }

    for (let student of await api.getStudents({group_id: 17867})) {
        console.log(student);
    }

} catch (e) {
    console.log(e);
}
```

### async/await
Всі методи классу `KneuApi` є асинхроними. Виклакати їх потрібно:
 1) В асинхроних функціях з ключовими словом await
```javascript
document.addEventListener("DOMContentLoaded", async function() {
    try {
      let departments = await api.getDepartments({faculty_id: 3});
      for (let department of departments) {
        console.log(department);
      }
    } catch (e) {
        console.log(e);
    }
});
```
 2) В синхроних (звичайних) функціях методи повертають об'єкт Promise. 
```javascript
api.getDepartments({faculty_id: 3}).then(function (departments) {
  for (let department of departments) {
    console.log(department);
  }
}, function (e) {
  console.log(e);
}); 
```
Детальніше про [JS acync/await](https://uk.javascript.info/async-await)


