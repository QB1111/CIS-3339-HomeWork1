import express from 'express';
import fs from 'fs';
const app = express();
const port = 3000;

// allow json body
app.use(express.json());
// allow cross origin
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// load data
function loadStudents() {
  const raw = fs.readFileSync('./students.json', 'utf8');
  return JSON.parse(raw);
}
function saveStudents(data) {
  fs.writeFileSync('./students.json', JSON.stringify(data, null, 2));
}

function loadCourses() {
  const raw = fs.readFileSync('./courses.json', 'utf8');
  return JSON.parse(raw);
}
function saveCourses(data) {
  fs.writeFileSync('./courses.json', JSON.stringify(data, null, 2));
}

function loadEnrollments() {
  const raw = fs.readFileSync('./enrollments.json', 'utf8');
  return JSON.parse(raw);
}
function saveEnrollments(data) {
  fs.writeFileSync('./enrollments.json', JSON.stringify(data, null, 2));
}

// ========= Student APIs =========
// Add student
app.post('/add-student', (req, res) => {
  const students = loadStudents();
  const newStu = {
    id: req.body.id,
    name: req.body.name,
    phone: req.body.phone,
    zip: req.body.zip
  };
  const exists = students.find(s => s.id == newStu.id);
  if (exists) {
    return res.json({ message: "Student ID already exists" });
  }
  students.push(newStu);
  saveStudents(students);
  res.json({ message: "Student added successfully" });
});

// Find student by name
app.post('/find-student', (req, res) => {
  const students = loadStudents();
  const searchName = req.body.name.trim().toLowerCase();
  const found = students.find(s => s.name.toLowerCase() === searchName);
  if (!found) {
    return res.status(400).json({ error: "Student not found" });
  }
  res.json(found);
});

// Delete student by name
app.post('/delete-student', (req, res) => {
  let students = loadStudents();
  const delName = req.body.name.trim().toLowerCase();
  const beforeCount = students.length;
  students = students.filter(s => s.name.toLowerCase() !== delName);
  if (students.length === beforeCount) {
    return res.json({ message: "Student not found" });
  }
  saveStudents(students);
  res.json({ message: "Student deleted successfully" });
});

// ========= Course APIs =========
// Get all courses
app.get('/all-courses', (req, res) => {
  const courses = loadCourses();
  res.json(courses);
});

// Add course
app.post('/add-course', (req, res) => {
  const courses = loadCourses();
  const newCourse = {
    id: req.body.id,
    title: req.body.title
  };
  const exists = courses.find(c => c.id == newCourse.id);
  if (exists) {
    return res.json({ message: "Course ID already exists" });
  }
  courses.push(newCourse);
  saveCourses(courses);
  res.json({ message: "Course added successfully" });
});

// Delete course
app.post('/delete-course', (req, res) => {
  let courses = loadCourses();
  const cid = Number(req.body.id);
  courses = courses.filter(c => c.id !== cid);
  saveCourses(courses);

  // also delete related enrollments
  let enrollments = loadEnrollments();
  enrollments = enrollments.filter(e => e.courseId !== cid);
  saveEnrollments(enrollments);
  res.json({ message: "Course deleted" });
});

// ========= Enroll APIs =========
app.post('/enroll', (req, res) => {
  const enrollments = loadEnrollments();
  const sid = Number(req.body.studentId);
  const cid = Number(req.body.courseId);

  const students = loadStudents();
  const courses = loadCourses();
  const stuExists = students.find(s => s.id === sid);
  const courseExists = courses.find(c => c.id === cid);
  if (!stuExists || !courseExists) {
    return res.status(400).json({ error: "Student or Course does not exist" });
  }

  const already = enrollments.find(e => e.studentId === sid && e.courseId === cid);
  if (already) {
    return res.json({ message: "Already enrolled" });
  }
  enrollments.push({ studentId: sid, courseId: cid });
  saveEnrollments(enrollments);
  res.json({ message: "Enroll successful" });
});

// Get all students in one course
app.get('/course-students/:cid', (req, res) => {
  const cid = Number(req.params.cid);
  const enrollments = loadEnrollments();
  const students = loadStudents();
  const enrolledIds = enrollments.filter(e => e.courseId === cid).map(e => e.studentId);
  const result = students.filter(s => enrolledIds.includes(s.id));
  res.json(result);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
