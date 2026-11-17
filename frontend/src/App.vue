<template>
 <div class="shell">
  <header><h1>CIS 3339 Homework 1</h1><p>Student Management System</p></header>
  <nav aria-label="Main navigation"><RouterLink to="/students">Students</RouterLink><RouterLink to="/courses">Courses</RouterLink><RouterLink to="/enrollments">Enrollments</RouterLink></nav>
  <main><RouterView /></main>
 </div>
</template>
