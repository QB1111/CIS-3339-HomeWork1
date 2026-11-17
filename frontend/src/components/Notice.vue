<script setup>
defineProps({ message: { type: String, default: '' }, error: { type: Boolean, default: false } })
</script>
<template><p v-if="message" role="status" :class="['notice', error ? 'error' : 'success']">{{ message }}</p></template>
