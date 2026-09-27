<template>
  <main class="app-main">
    <Users />
  </main>
</template>

<script setup lang="ts">
import Users from './components/Users.vue'
</script>

<style>

body {
  margin: 0;
  padding: 0;
  background-color: #f7fafc;
}

.app-main {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}
</style>