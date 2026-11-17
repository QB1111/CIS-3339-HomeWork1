import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
export const useSchoolStore = defineStore('school', () => {
 const students = ref([]), courses = ref([]), loading = ref(false)
 async function refresh() {
  loading.value = true
  try {
   const [s,c] = await Promise.all([axios.get('/api/students'),axios.get('/api/courses')])
   students.value=s.data;courses.value=c.data
  } finally {loading.value=false}
 }
 return { students,courses,loading,refresh }
})
