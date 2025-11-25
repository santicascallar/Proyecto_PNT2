<template>
  <section class="container">
    <h2 class="section-title">Todas las Reservas </h2>

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
          <th>Acciones</th>
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
          <td>
            <button @click="updateStatus(r._id, 'confirmed')">Aceptar</button>
            <button @click="updateStatus(r._id, 'pending')">Rechazar</button>
        </td>
        </tr>
      </tbody>
    </table>

    <h2 class="section-title">Restaurantes con menos reservas el martes</h2>
    <table v-if="reservations.length" class="card" style="padding:1rem; width:100%">
    <tbody>
      <tr v-for="r in leastTuesday" :key="r._id">
        <td>{{ r.name }}</td>
        <td>{{ r.tuesdayCount }}</td>
      </tr>
    </tbody>
    </table>

    <h2 class="section-title">Restaurantes más reservados</h2>
    <table v-if="topRestaurants.length" class="card" style="padding:1rem; width:100%">
    <tbody>
      <tr v-for="r in topRestaurants" :key="r._id">
        <td>{{ r.restaurant?.name }}</td>
        <td>{{ r.count }}</td>
      </tr>
    </tbody>
    </table>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getReservations, updateReservation } from "../../services/reservations.api.js";
import { getLeastReservationsTuesday, getTopRestaurants, createRestaurant } from "../../services/restaurants.api.js";


const reservations = ref([]);
const loading = ref(false);
const error = ref(null);

const leastTuesday = ref([]);
const topRestaurants = ref([]);

function formatDate(d) {
  return new Date(d).toLocaleString();
}

onMounted(async () => {
  loading.value = true;
  try {
    reservations.value = await getReservations();
    leastTuesday.value = await getLeastReservationsTuesday(5);
    topRestaurants.value = await getTopRestaurants(30, 5);
  } catch (e) {
    console.error(e);
    error.value = "Error al cargar reservas";
  } finally {
    loading.value = false;
  }
});

async function updateStatus(id, newStatus) {
  try {
    loading.value = true;

    await updateReservation(id, { status: newStatus })
    reservations.value = await getReservations();

  } catch (e) {
    console.error(e);
    error.value = "No se pudo actualizar la reserva";
  } finally {
    loading.value = false;
  }
}
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