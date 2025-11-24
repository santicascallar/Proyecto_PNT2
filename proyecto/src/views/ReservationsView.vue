<template>
  <section class="container">
    <h2 class="section-title">Mis reservas</h2>

    <section v-if="!reservations.length" class="muted">No tenés reservas.</section>

    <div v-else>
      <h3>Próximas</h3>
      <ul v-if="upcoming.length" class="list">
        <li v-for="r in upcoming" :key="r._id || r.id" class="card" style="padding: 0.8rem 1rem">
          <strong>{{ restaurantName(r) }}</strong> — {{ formatDate(r) }} — {{ r.people || r.partySize }} personas
          <button @click="cancelReservation(r._id || r.id)" style="margin-left: 0.6rem">Cancelar</button>
        </li>
      </ul>
      <p v-else class="muted">No hay reservas próximas.</p>

      <h3 style="margin-top: 1rem">Historial</h3>
      <ul v-if="past.length" class="list">
        <li v-for="r in past" :key="r._id || r.id" class="card" style="padding: 0.8rem 1rem">
          <strong>{{ restaurantName(r) }}</strong> — {{ formatDate(r) }} — {{ r.people || r.partySize }} personas
        </li>
      </ul>
      <p v-else class="muted">No hay reservas anteriores.</p>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useReservations } from "../stores/reservations.js";
import { useAuth } from "../stores/auth.js";
import { useRouter } from "vue-router";

const store = useReservations();
const auth = useAuth();
const router = useRouter();
const { list: reservations } = storeToRefs(store);

onMounted(async () => {
  if (!auth.isLogged) {
    router.push({ name: "login", query: { redirect: "/reservas" } });
    return;
  }
  const userId = auth.user?._id || auth.user?.id;
  if (!userId) return;
  await store.fetchByUser(userId, auth.token);
});

const now = () => Date.now();

const upcoming = computed(() =>
  reservations.value
    .filter((r) => {
      const d = new Date(r.date || r.datetime || r.createdAt).getTime();
      return !isNaN(d) && d > now();
    })
    .sort((a, b) => new Date(a.date || a.datetime) - new Date(b.date || b.datetime))
);

const past = computed(() =>
  reservations.value
    .filter((r) => {
      const d = new Date(r.date || r.datetime || r.createdAt).getTime();
      return !isNaN(d) && d <= now();
    })
    .sort((a, b) => new Date(b.date || b.datetime) - new Date(a.date || a.datetime))
);

const totalPeopleUpcoming = computed(() => upcoming.value.reduce((acc, r) => acc + Number(r.people || r.partySize || 0), 0));

function formatDate(r) {
  const d = new Date(r.date || r.datetime || r.createdAt);
  return isNaN(d) ? "Fecha inválida" : d.toLocaleString();
}

function restaurantName(r) {
  return r.restaurantName || (r.restaurant && (r.restaurant.name || r.restaurant.title)) || "Restaurante";
}

async function cancelReservation(id) {
  if (!confirm("Cancelar reserva?")) return;
  try {
    await store.remove(id, auth.token);
    store.list = store.list.filter((x) => (x._id || x.id) !== id);
    alert("Reserva cancelada");
  } catch (e) {
    console.error("Error cancelando reserva", e);
    alert("No se pudo cancelar: " + (e.message || e));
  }
}
</script>

<style scoped>
.list {
  display: grid;
  gap: 0.75rem;
}
</style>
