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
      <div v-if="error" class="muted">Error: {{ error }}</div>
      <div v-else-if="chartLabels.length">
        <SimpleBarChart :labels="chartLabels" :values="chartValues" />
      </div>
      <p v-else class="muted">No hay resultados aún.</p>
    </section>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useAuth } from "../stores/auth.js";
import { fetchLeastReservationsReport, fetchTopRestaurantsReport } from "../services/admin.api.js";
import SimpleBarChart from "../components/SimpleBarChart.vue";

const auth = useAuth();
const loadingSales = ref(false);
const loadingRes = ref(false);
const result = ref(null);
const error = ref(null);
const chartLabels = ref([]);
const chartValues = ref([]);

function parseToChart(data) {
  chartLabels.value = [];
  chartValues.value = [];
  if (!data) return;
  // If array of numbers
  if (Array.isArray(data) && data.every((x) => typeof x === "number")) {
    chartLabels.value = data.map((_, i) => `${i + 1}`);
    chartValues.value = data.map((x) => Number(x));
    return;
  }
  // If array of objects
  if (Array.isArray(data) && data.length && typeof data[0] === "object") {
    const obj = data[0];
    const labelKeys = ["name", "restaurant", "label", "title", "day"];
    const valueKeys = ["count", "value", "reservations", "total", "qty"];
    const labelKey = labelKeys.find((k) => k in obj) || Object.keys(obj)[0];
    const valueKey = valueKeys.find((k) => k in obj) || Object.keys(obj).find((k) => typeof obj[k] === "number") || Object.keys(obj)[1];
    data.forEach((it) => {
      chartLabels.value.push(String(it[labelKey] ?? it.name ?? it.restaurant ?? ""));
      chartValues.value.push(Number(it[valueKey] ?? Object.values(it).find((v) => typeof v === "number") ?? 0));
    });
    return;
  }
  // If object with numeric values
  if (data && typeof data === "object") {
    const keys = Object.keys(data);
    chartLabels.value = keys;
    chartValues.value = keys.map((k) => Number(data[k] || 0));
    return;
  }
}

async function runLeastReservations() {
  loadingSales.value = true;
  result.value = null;
  error.value = null;
  try {
    const data = await fetchLeastReservationsReport(auth.token);
    result.value = data;
    parseToChart(data);
  } catch (e) {
    result.value = null;
    error.value = e.message || String(e);
  } finally {
    loadingSales.value = false;
  }
}

async function runTopRestaurants() {
  loadingRes.value = true;
  result.value = null;
  error.value = null;
  try {
    const data = await fetchTopRestaurantsReport(auth.token);
    result.value = data;
    parseToChart(data);
  } catch (e) {
    result.value = null;
    error.value = e.message || String(e);
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
