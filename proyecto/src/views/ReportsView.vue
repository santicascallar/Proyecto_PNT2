<template>
  <section class="container">
    <h2 class="section-title">Reportes</h2>

    <p>Solo los administradores podrán ver y ejecutar estos reportes.</p>

    <div style="display: flex; gap: 1rem; margin-top: 1rem">
      <button @click="runLeastReservations" :disabled="loadingSales">Menos reservas los martes</button>
      <button @click="runTopRestaurants" :disabled="loadingRes">Top restaurantes con mas reservas</button>
    </div>

    <section style="margin-top: 1rem">
      <h3>Resultado</h3>
      <pre v-if="result">{{ JSON.stringify(result, null, 2) }}</pre>
      <p v-else class="muted">No hay resultados aún.</p>
    </section>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useAuth } from "../stores/auth.js";
import { fetchLeastReservationsReport, fetchTopRestaurantsReport } from "../services/admin.api.js";

const auth = useAuth();
const loadingSales = ref(false);
const loadingRes = ref(false);
const result = ref(null);

async function runLeastReservations() {
  loadingSales.value = true;
  result.value = null;
  try {
    const data = await fetchLeastReservationsReport(auth.token);
    result.value = data;
  } catch (e) {
    result.value = { error: e.message || e };
  } finally {
    loadingSales.value = false;
  }
}

async function runTopRestaurants() {
  loadingRes.value = true;
  result.value = null;
  try {
    const data = await fetchTopRestaurantsReport(auth.token);
    result.value = data;
  } catch (e) {
    result.value = { error: e.message || e };
  } finally {
    loadingRes.value = false;
  }
}
</script>

<style scoped>
.muted {
  color: var(--muted);
}
pre {
  background: #0b0c10;
  padding: 1rem;
  border-radius: 6px;
  color: var(--text);
  overflow: auto;
}
</style>
