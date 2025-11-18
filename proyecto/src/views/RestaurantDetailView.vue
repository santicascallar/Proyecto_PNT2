<template>
  <section v-if="r" class="detail-wrapper">
    <div class="detail-card">
      <img :src="r.cover || r.imageUrl || fallback" class="hero" />

      <div class="content">
        <h1 class="title">{{ r.name }}</h1>

        <p class="meta">{{ r.cuisine }} • {{ r.price }} • ⭐ {{ r.rating }}</p>

        <p class="info-line">📍 {{ r.address }}</p>
        <p class="info-line">🏙️ Zona: {{ r.zona }}</p>

        <p class="description">{{ r.descripcion }}</p>

        <button class="btn-reserve" @click="book">Reservar</button>
        <button class="fav-btn" @click="toggleFav">
          {{ isFav ? "💗" : "🤍" }}
        </button>
      </div>
    </div>

    <BookingDrawer :open="open" :restaurant="r" @close="open = false" @confirm="confirm" />
  </section>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useRestaurantsStore } from "../stores/restaurants.js";
import { useReservations } from "../stores/reservations.js";
import { useAuth } from "../stores/auth.js";
import { updateUser, updateUserWithToken } from "../services/users.api.js";  // ⬅ IMPORTANTE
import BookingDrawer from "../components/BookingDrawer.vue";

const fallback = new URL("../assets/restaurant-placeholder.jpg", import.meta.url).href;

const route = useRoute();
const store = useRestaurantsStore();
const reservations = useReservations();
const auth = useAuth();

const open = ref(false);

onMounted(() => {
  if (!store.list.length) store.fetchAll();
});

const r = computed(() =>
  store.list.find((x) => x.id == route.params.id || x._id == route.params.id)
);
const isFav = computed(() => {
  const userFavs = auth.user?.favorites || [];
  const restoId = r.value?._id || r.value?.id;
  return userFavs.includes(restoId);
});
async function toggleFav() {
  if (!auth.user) {
    alert("Debes iniciar sesión para marcar favoritos");
    return;
  }

  const userId = auth.user._id || auth.user.id;
  const restoId = r.value._id || r.value.id;

  const favs = auth.user.favorites || [];
  const newFavorites = favs.includes(restoId)
    ? favs.filter((id) => id !== restoId)
    : [...favs, restoId];

  const oldFavorites = Array.isArray(favs) ? [...favs] : [];
  auth.user.favorites = newFavorites;

  try {
    // Use the token-aware function so the backend can authorize the change
    await updateUserWithToken(userId, { favorites: newFavorites }, auth.token);
  } catch (e) {
    console.error("Error actualizando favoritos", e);
    // Revert local changes on failure
    auth.user.favorites = oldFavorites;
    alert("No se pudo actualizar favoritos");
  }
}

function book() {
  open.value = true;
}

async function confirm(payload) {
  open.value = false;
  if (!auth.token) {
    alert("Debes iniciar sesión para crear una reserva");
    return;
  }

  const reservationBody = {
    date: payload.datetime,
    partySize: payload.people,
    restaurant: r.value?._id || r.value?.id || payload.restaurantId,
    user: auth.user?._id || auth.user?.id,
  };

  try {
    await reservations.create(reservationBody, auth.token);
    alert("Reserva creada correctamente");
  } catch (e) {
    console.error("Error creando reserva", e);
    alert("No se pudo crear la reserva: " + (e.message || e));
  }
}
</script>


<style scoped>
.detail-wrapper {
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;
  color: #e6eefc;
}

.detail-card {
  background: #111827;
  padding: 1.5rem;
  border-radius: 16px;
  width: 100%;
  max-width: 720px;
  display: grid;
  gap: 1.2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
}

.hero {
  width: 100%;
  height: 300px;
  border-radius: 14px;
  object-fit: cover;
}

.content {
  display: grid;
  gap: 0.6rem;
  text-align: center;
}

.title {
  font-size: 2rem;
  font-weight: 600;
}

.meta {
  font-size: 1.05rem;
  color: #cdd3dd;
}

.info-line {
  font-size: 0.95rem;
  color: #d1d5db;
}

.description {
  font-size: 1rem;
  line-height: 1.4;
  margin-top: 0.5rem;
}

.btn-reserve {
  background: #3b82f6;
  padding: 0.8rem 1.2rem;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin-top: 0.5rem;
}

.btn-reserve:hover {
  background: #2563eb;
}

.fav-btn {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font-size: 18px;
  cursor: pointer;
  line-height: 1;
}
</style>
