```
# CIS 3339 Homework 1
This project uses Node.js/Express REST API as backend and Vue 3 as frontend.

## How to run
1. Start backend
```

cd backend
node server.js

```
Backend server runs on http://localhost:3000

2. Start frontend
```

cd frontend
npm install axios
npm run dev

```
Frontend webpage: http://localhost:5174

## Features
- Add Student (id, name, phone, zip; prevents duplicate student ID)
- Find Student by Name (return student id, name, phone, zip)
- Delete Student by Name
- Add Course (prevents duplicate course ID)
- Delete Course (also removes related enrollment records)
- Enroll student into a course
- Show all enrolled students in a selected course
```