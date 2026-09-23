<template>
  <div class="container">
    <h1>Student Manager</h1>

    <!-- Add Student -->
    <div class="card">
      <h3>Add Student</h3>
      <input v-model="newStudent.name" placeholder="Name" />
      <input v-model="newStudent.id" placeholder="ID" />
      <input v-model="newStudent.phone" placeholder="Phone" />
      <input v-model="newStudent.zip" placeholder="Zip" />
      <button @click="addStudent">Add</button>
    </div>

    <!-- Find Student -->
    <div class="card">
      <h3>Find Student By Name</h3>
      <input v-model="searchName" placeholder="Enter name to search" />
      <button @click="findStudent">Search</button>
      <div v-if="foundStudent">
        <p>Name: {{ foundStudent.name }}</p>
        <p>ID: {{ foundStudent.id }}</p>
        <p>Phone: {{ foundStudent.phone }}</p>
        <p>Zip: {{ foundStudent.zip }}</p>
      </div>
    </div>

    <!-- Delete Student -->
    <div class="card">
      <h3>Delete Student By Name</h3>
      <input v-model="deleteName" placeholder="Enter name to delete" />
      <button @click="deleteStudent">Delete</button>
    </div>

    <!-- ========== 新增：Add Course ========== -->
    <div class="card">
      <h3>Add a Course</h3>
      <input v-model="newCourse.id" placeholder="Class ID" />
      <input v-model="newCourse.name" placeholder="Class Name" />
      <button @click="addCourse">Add Course</button>
    </div>

    <!-- ========== 新增：Enroll Student in Course ========== -->
    <div class="card">
      <h3>Enroll Student in Course</h3>
      <div>
        <label>Select Student:</label>
        <select v-model="selectedStudentId">
          <option value="">-- Select Student --</option>
          <option v-for="stu in studentList" :key="stu.id" :value="stu.id">
            {{ stu.name }} ({{ stu.id }})
          </option>
        </select>
      </div>
      <div style="margin-top:10px;">
        <label>Select Course:</label>
        <select v-model="selectedCourseId">
          <option value="">-- Select Course --</option>
          <option v-for="course in courseList" :key="course.id" :value="course.id">
            {{ course.name }}
          </option>
        </select>
      </div>
      <button @click="enrollStudent" style="margin-top:10px">Enroll Student</button>
    </div>

    <!-- ========== 新增：Students in Course ========== -->
    <div class="card">
      <h3>Students in Course</h3>
      <div>
        <label>Select Course:</label>
        <select v-model="selectedCourseForList">
          <option value="">-- Select Course --</option>
          <option v-for="course in courseList" :key="course.id" :value="course.id">
            {{ course.name }}
          </option>
        </select>
        <button @click="listStudentsInCourse">List Students</button>
      </div>
      <table v-if="enrolledStudents.length > 0" style="margin-top:10px;border-collapse: collapse;">
        <thead>
          <tr>
            <th>Name</th>
            <th>ID</th>
            <th>Phone</th>
            <th>Zip</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="stu in enrolledStudents" :key="stu.id">
            <td>{{ stu.name }}</td>
            <td>{{ stu.id }}</td>
            <td>{{ stu.phone }}</td>
            <td>{{ stu.zip }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ========== 新增：Courses List + Delete Course ========== -->
    <div class="card">
      <h3>Courses List</h3>
      <button @click="loadCourseList">List Courses</button>
      <table v-if="courseList.length>0" style="margin-top:10px;border-collapse: collapse;">
        <thead>
          <tr>
            <th>Class ID</th>
            <th>Class Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in courseList" :key="course.id">
            <td>{{ course.id }}</td>
            <td>{{ course.name }}</td>
            <td><button @click="deleteCourse(course.id)">Delete</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="msg">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// 学生原有变量
const newStudent = ref({ name:'', id:'', phone:'', zip:'' })
const searchName = ref('')
const deleteName = ref('')
const foundStudent = ref(null)
const message = ref('')

// =====课程相关变量=====
const newCourse = ref({ id:'', name:'' })
const studentList = ref([])
const courseList = ref([])
const selectedStudentId = ref('')
const selectedCourseId = ref('')
const selectedCourseForList = ref('')
const enrolledStudents = ref([])

// =====学生原有函数=====
const addStudent = async () => {
  try {
    const res = await axios.post('http://localhost:3000/add-student', newStudent.value)
    message.value = res.data.message
    newStudent.value = { name:'', id:'', phone:'', zip:'' }
    loadStudentList()
  } catch(err){
    message.value = err.response?.data.error || 'Add failed'
  }
}

const findStudent = async () => {
  foundStudent.value = null
  try {
    const res = await axios.post('http://localhost:3000/find-student', { name: searchName.value })
    foundStudent.value = res.data
    message.value = ''
  } catch(err){
    message.value = err.response?.data.error || 'Search failed'
  }
}

const deleteStudent = async () => {
  try {
    const res = await axios.post('http://localhost:3000/delete-student', { name: deleteName.value })
    message.value = res.data.message
    deleteName.value = ''
    loadStudentList()
  } catch(err){
    message.value = err.response?.data.error || 'Delete failed'
  }
}

// ==========新增后端接口调用函数==========
// 加载全部学生
const loadStudentList = async () => {
  try {
    const res = await axios.get('http://localhost:3000/all-students')
    studentList.value = res.data
  } catch(err) {
    message.value = "Failed to load students"
  }
}

// 加载全部课程
const loadCourseList = async () => {
  try {
    const res = await axios.get('http://localhost:3000/all-courses')
    courseList.value = res.data
  } catch(err) {
    message.value = "Failed to load courses"
  }
}

// 添加课程
const addCourse = async () => {
  try {
    const res = await axios.post('http://localhost:3000/add-course', newCourse.value)
    message.value = res.data.message
    newCourse.value = { id:'', name:'' }
    loadCourseList()
  } catch(err){
    message.value = err.response?.data.error || 'Add course failed'
  }
}

// 删除课程
const deleteCourse = async (courseId) => {
  try {
    const res = await axios.post('http://localhost:3000/delete-course', {id: courseId})
    message.value = res.data.message
    loadCourseList()
  } catch(err){
    message.value = err.response?.data.error || 'Delete course failed'
  }
}

// 选课
const enrollStudent = async () => {
  if(!selectedStudentId || !selectedCourseId){
    message.value = "Please select student and course"
    return
  }
  try{
    const res = await axios.post('http://localhost:3000/enroll', {
      studentId: selectedStudentId,
      courseId: selectedCourseId
    })
    message.value = res.data.message
  }catch(err){
    message.value = err.response?.data.error || "Enroll failed"
  }
}

// 查询某个课程下所有已选学生
const listStudentsInCourse = async () => {
  if(!selectedCourseForList){
    message.value = "Please select a course"
    enrolledStudents.value = []
    return
  }
  try{
    const res = await axios.get(`http://localhost:3000/course-students/${selectedCourseForList}`)
    enrolledStudents.value = res.data
  }catch(err){
    message.value = err.response?.data.error || "Load students failed"
    enrolledStudents.value = []
  }
}

// 页面载入自动加载学生和课程列表
onMounted(() => {
  loadStudentList()
  loadCourseList()
})
</script>

<style>
.container { max-width:700px; margin: 30px auto; padding:20px; }
.card { border:1px solid #ccc; padding:15px; margin:12px 0; border-radius:8px; }
input { display:block; width:90%; margin:8px 0; padding:8px; }
select { padding:6px; min-width:300px; }
button { padding:8px 16px; cursor:pointer; margin:4px; }
.msg { color:darkblue; font-weight:bold; }
table {width:100%;margin-top:8px;}
th,td {border:1px solid #999;padding:6px;text-align:left;}
</style>
