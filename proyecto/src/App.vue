<template>
  <div class="layout">
    <NavBar />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
</script>

<style scoped>
.layout { min-height: 100vh; display: flex; flex-direction: column; }
main { flex: 1; width: 100%; }
</style>