<template>
  <section class="container">
    <h2 class="section-title">Mis reservas</h2>
    <p v-if="!res.length" class="muted">No tenés reservas.</p>
    <ul v-else class="list">
      <li v-for="r in res" :key="r.id" class="card" style="padding: .8rem 1rem;">
        <strong>{{ r.restaurantName }}</strong> — {{ new Date(r.datetime).toLocaleString() }} — {{ r.people }} personas
        <button @click="cancel(r.id)" style="margin-left:.6rem;">Cancelar</button>
      </li>
    </ul>
    <p v-if="res.length">Total de personas reservadas: <strong>{{ totalPeople }}</strong></p>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useReservations } from '../stores/reservations'
const store = useReservations()
const { list: res } = storeToRefs(store)
const totalPeople = computed(() => res.value.reduce((acc, r) => acc + Number(r.people || 0), 0))
function cancel(id){ store.cancel(id) }
</script>

<style scoped>
.list { display: grid; gap: .75rem; }
</style>