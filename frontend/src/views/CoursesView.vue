<script setup>
import { ref,onMounted } from 'vue'
import axios from 'axios'
import { useSchoolStore } from '../stores/school'
import Notice from '../components/Notice.vue'
const store=useSchoolStore(),form=ref({id:'',title:''}),message=ref(''),error=ref(false),busy=ref(false)
function show(t,e=false){message.value=t;error.value=e}
onMounted(async()=>{try{await store.refresh()}catch(e){show('Cannot load courses',true)}})
async function add(){if(!form.value.id.trim()||!form.value.title.trim())return show('Both fields are required',true);busy.value=true;try{await axios.post('/api/courses',form.value);form.value={id:'',title:''};await store.refresh();show('Course added successfully')}catch(e){show(e.response?.data?.error||'Could not add course',true)}finally{busy.value=false}}
async function remove(c){if(!confirm(`Delete ${c.id}? Related enrollments will also be removed.`))return;busy.value=true;try{await axios.delete(`/api/courses/${encodeURIComponent(c.id)}`);await store.refresh();show('Course deleted successfully')}catch(e){show(e.response?.data?.error||'Could not delete course',true)}finally{busy.value=false}}
</script>
<template><h2>Courses</h2><Notice :message="message" :error="error" /><section class="panel"><h3>Add Course</h3><form class="form-grid" @submit.prevent="add"><label>Course ID<input v-model.trim="form.id" placeholder="CIS 3339" required /></label><label>Course Name<input v-model.trim="form.title" placeholder="Enterprise Applications Development" required /></label><button :disabled="busy">Add Course</button></form></section><section class="panel"><h3>All Courses</h3><p v-if="store.loading">Loading courses...</p><p v-else-if="!store.courses.length">No courses yet.</p><div v-else class="table-wrap"><table><thead><tr><th>Course ID</th><th>Course Name</th><th>Action</th></tr></thead><tbody><tr v-for="c in store.courses" :key="c.id"><td>{{c.id}}</td><td>{{c.title}}</td><td><button class="danger" :disabled="busy" @click="remove(c)">Delete</button></td></tr></tbody></table></div></section></template>
