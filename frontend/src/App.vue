<template>
  <div class="container">
    <h1>CIS 3339 Homework 1</h1>

    <!-- Add Student 【增加 Zip 输入框】 -->
    <div class="box">
      <h3>Add Student</h3>
      <input v-model="newStudent.id" placeholder="Student ID" type="number" />
      <input v-model="newStudent.name" placeholder="Student Name" />
      <input v-model="newStudent.phone" placeholder="Phone" />
      <input v-model="newStudent.zip" placeholder="Zip Code" />
      <button @click="addStudent">Add</button>
      <p>{{ msgAddStu }}</p>
    </div>

    <!-- Find Student -->
    <div class="box">
      <h3>Find Student By Name</h3>
      <input v-model="searchName" placeholder="Enter name" />
      <button @click="findStudent">Find</button>
      <div v-if="studentResult">
        <p>ID: {{ studentResult.id }}</p>
        <p>Name: {{ studentResult.name }}</p>
        <p>Phone: {{ studentResult.phone }}</p>
        <p>Zip: {{ studentResult.zip }}</p>
      </div>
      <p style="color:red">{{ msgFindStu }}</p>
    </div>

    <!-- Delete Student -->
    <div class="box">
      <h3>Delete Student By Name</h3>
      <input v-model="delStuName" placeholder="Enter name" />
      <button @click="deleteStudent">Delete</button>
      <p>{{ msgDelStu }}</p>
    </div>

    <!-- Add Course -->
    <div class="box">
      <h3>Add Course</h3>
      <input v-model="newCourse.id" placeholder="Course ID" type="number" />
      <input v-model="newCourse.title" placeholder="Course Title" />
      <button @click="addCourse">Add</button>
      <p>{{ msgAddCourse }}</p>
    </div>

    <!-- Enroll Student -->
    <div class="box">
      <h3>Enroll Student to Course</h3>
      <input v-model="enrollStuId" placeholder="Student ID" type="number" />
      <input v-model="enrollCourseId" placeholder="Course ID" type="number" />
      <button @click="enroll">Enroll</button>
      <p>{{ msgEnroll }}</p>
    </div>

    <!-- Show students in a course -->
    <div class="box">
      <h3>Show Students in Course</h3>
      <input v-model="queryCourseId" placeholder="Course ID" type="number" />
      <button @click="getCourseStudents">Search</button>
      <div v-for="s in courseStudentList" :key="s.id">
        <p>ID: {{ s.id }} - Name: {{ s.name }} - Zip: {{ s.zip }}</p>
      </div>
    </div>

    <!-- All Courses -->
    <div class="box">
      <h3>All Courses</h3>
      <div v-for="c in courseList" :key="c.id">
        <span>{{ c.id }} {{ c.title }}</span>
        &nbsp;&nbsp;
        <button @click="deleteCourse(c.id)">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Student 【增加 zip】
const newStudent = ref({id:'', name:'', phone:'', zip:''})
const searchName = ref('')
const studentResult = ref(null)
const msgFindStu = ref('')
const delStuName = ref('')
const msgAddStu = ref('')
const msgDelStu = ref('')

// Course
const newCourse = ref({id:'', title:''})
const msgAddCourse = ref('')
const courseList = ref([])

// Enroll
const enrollStuId = ref('')
const enrollCourseId = ref('')
const msgEnroll = ref('')
const queryCourseId = ref('')
const courseStudentList = ref([])

// Load all courses on page load
const loadCourses = async () => {
  const res = await axios.get('http://localhost:3000/all-courses')
  courseList.value = res.data
}

onMounted(()=>{
  loadCourses()
})

// Add student
const addStudent = async () => {
  try {
    const res = await axios.post('http://localhost:3000/add-student', newStudent.value)
    msgAddStu.value = res.data.message
  } catch(err) {
    console.log(err)
  }
}

// Find student
const findStudent = async () => {
  msgFindStu.value = ''
  studentResult.value = null
  try {
    const res = await axios.post('http://localhost:3000/find-student', {
      name: searchName.value
    })
    studentResult.value = res.data
  } catch(err) {
    msgFindStu.value = err.response.data.error
  }
}

// Delete student
const deleteStudent = async () => {
  try {
    const res = await axios.post('http://localhost:3000/delete-student', {
      name: delStuName.value
    })
    msgDelStu.value = res.data.message
  } catch(err) {
    console.log(err)
  }
}

// Add course
const addCourse = async () => {
  try {
    const res = await axios.post('http://localhost:3000/add-course', newCourse.value)
    msgAddCourse.value = res.data.message
    loadCourses()
  } catch(err) {
    console.log(err)
  }
}

// Delete course
const deleteCourse = async (cid) => {
  try {
    await axios.post('http://localhost:3000/delete-course', {id: cid})
    loadCourses()
  } catch(err) {
    console.log(err)
  }
}

// Enroll
const enroll = async () => {
  try {
    const res = await axios.post('http://localhost:3000/enroll', {
      studentId: enrollStuId.value,
      courseId: enrollCourseId.value
    })
    msgEnroll.value = res.data.message
  } catch(err) {
    console.log(err)
  }
}

// Get students in course
const getCourseStudents = async () => {
  try {
    const res = await axios.get(`http://localhost:3000/course-students/${queryCourseId.value}`)
    courseStudentList.value = res.data
  } catch(err) {
    console.log(err)
  }
}
</script>

<style>
.container {
  max-width:700px;
  margin: 2rem auto;
  padding: 0 1rem;
}
.box {
  border: 1px solid #ccc;
  padding:1rem;
  margin:1rem 0;
  border-radius: 8px;
}
input {
  margin:0.3rem;
  padding:0.4rem;
}
button {
  padding:0.4rem 0.8rem;
  cursor:pointer;
}
</style>
