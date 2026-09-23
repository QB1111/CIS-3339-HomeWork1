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

    <p class="msg">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const newStudent = ref({ name:'', id:'', phone:'', zip:'' })
const searchName = ref('')
const deleteName = ref('')
const foundStudent = ref(null)
const message = ref('')

// add student
const addStudent = async () => {
  try {
    const res = await axios.post('http://localhost:3000/add-student', newStudent.value)
    message.value = res.data.message
    newStudent.value = { name:'', id:'', phone:'', zip:'' }
  } catch(err){
    message.value = err.response?.data.error || 'Add failed'
  }
}

// find student
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

// delete student
const deleteStudent = async () => {
  try {
    const res = await axios.post('http://localhost:3000/delete-student', { name: deleteName.value })
    message.value = res.data.message
    deleteName.value = ''
  } catch(err){
    message.value = err.response?.data.error || 'Delete failed'
  }
}
</script>

<style>
.container { max-width:600px; margin: 30px auto; padding:20px; }
.card { border:1px solid #ccc; padding:15px; margin:10px 0; border-radius:8px; }
input { display:block; width:90%; margin:8px 0; padding:8px; }
button { padding:8px 16px; cursor:pointer; }
.msg { color:darkblue; font-weight:bold; }
</style>

