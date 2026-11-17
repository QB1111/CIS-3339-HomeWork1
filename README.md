# CIS 3339 Homework 1

This project is a Student Management System using Vue 3 for the frontend, Node.js/Express for the backend, and MongoDB for the database.

## How to Run

1. Make sure MongoDB is running.

2. Open a terminal in the project folder.

3. Install dependencies:

```bash
npm run install:all
```

4. Build the frontend:

```bash
npm run build
```

5. Start the application:

```bash
npm start
```

6. Open http://localhost:3000 in your browser.

## Features

- Add Student (id, name, phone, zip; prevents duplicate student ID)
- Find Student by Name (return student id, name, phone, zip)
- Delete Student by Name
- Add Course (prevents duplicate course ID)
- Delete Course (also removes related enrollment records)
- Enroll student into a course
- Show all enrolled students in a selected course

## Technologies

- Vue 3
- Vue Router
- Pinia
- Node.js
- Express
- MongoDB
- Mongoose