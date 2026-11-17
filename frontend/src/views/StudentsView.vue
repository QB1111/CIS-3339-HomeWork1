<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useSchoolStore } from '../stores/school'
import Notice from '../components/Notice.vue'
const store=useSchoolStore()
const form=ref({id:'',name:'',phone:'',zip:''}),search=ref(''),message=ref(''),error=ref(false),busy=ref(false)
const results=computed(()=>store.students.filter(s=>s.name.toLowerCase().includes(search.value.trim().toLowerCase())))
onMounted(load)
async function load(){try{await store.refresh()}catch(e){show(e.response?.data?.error||'Cannot load students',true)}}
function show(text,isError=false){message.value=text;error.value=isError}
async function add(){
 if(Object.values(form.value).some(v=>!String(v).trim()))return show('Please complete all fields.',true)
 busy.value=true
 try{await axios.post('/api/students',form.value);form.value={id:'',name:'',phone:'',zip:''};await store.refresh();show('Student added successfully')}
 catch(e){show(e.response?.data?.error||'Could not add student',true)}finally{busy.value=false}
}
async function remove(s){
 if(!confirm(`Delete ${s.name} (${s.id})? Their enrollments will also be removed.`))return
 busy.value=true
 try{await axios.delete(`/api/students/${encodeURIComponent(s.id)}`);await store.refresh();show('Student deleted successfully')}
 catch(e){show(e.response?.data?.error||'Could not delete student',true)}finally{busy.value=false}
}
</script>
<template>
 <h2>Students</h2><Notice :message="message" :error="error" />
 <section class="panel"><h3>Add Student</h3><form @submit.prevent="add" class="form-grid">
  <label>Student ID<input v-model.trim="form.id" required placeholder="1001" /></label>
  <label>Name<input v-model.trim="form.name" required placeholder="John" /></label>
  <label>Phone<input v-model.trim="form.phone" required placeholder="555-1234" /></label>
  <label>ZIP Code<input v-model.trim="form.zip" required placeholder="77001" /></label>
  <button :disabled="busy">Add Student</button>
 </form></section>
 <section class="panel"><h3>Find Students</h3><label>Search by name<input v-model="search" placeholder="Enter a student name" /></label>
 <p v-if="store.loading">Loading students...</p><p v-else-if="!results.length">No students found.</p>
 <div v-else class="table-wrap"><table><thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>ZIP</th><th>Action</th></tr></thead><tbody><tr v-for="s in results" :key="s.id"><td>{{s.id}}</td><td>{{s.name}}</td><td>{{s.phone}}</td><td>{{s.zip}}</td><td><button class="danger" :disabled="busy" @click="remove(s)">Delete</button></td></tr></tbody></table></div>
 </section>
</template>
