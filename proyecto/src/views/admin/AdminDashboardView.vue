<template>
  <section class="container">
    <h2 class="section-title">Reservas</h2>

    <div v-if="loading">Cargando reservas...</div>
    <div v-if="error" style="color:red">{{ error }}</div>

    <table v-if="reservations.length" class="card" style="padding:1rem; width:100%">
      <thead>
        <tr>
          <th>Cliente</th>
          <th>Restaurante</th>
          <th>Fecha</th>
          <th>Personas</th>
          <th>Estado</th>
          <th>Notas</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="r in reservations" :key="r._id">
          <td>{{ r.user?.name }}</td>
          <td>{{ r.restaurant?.name }}</td>
          <td>{{ formatDate(r.date) }}</td>
          <td>{{ r.partySize }}</td>
          <td>{{ r.status }}</td>
          <td>{{ r.notes }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getReservations } from "../../services/api.js";

const reservations = ref([]);
const loading = ref(false);
const error = ref(null);

function formatDate(d) {
  return new Date(d).toLocaleString();
}

onMounted(async () => {
  loading.value = true;
  try {
    reservations.value = await getReservations();
  } catch (e) {
    error.value = "Error al cargar reservas";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
table {
  border-collapse: collapse;
}
td, th {
  padding: .4rem .6rem;
  border-bottom: 1px solid #ddd;
}
</style>