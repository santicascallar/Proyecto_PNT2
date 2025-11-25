<template>
  <section class="page">
    <header class="page__header">
      <h1 class="title">Mis Favoritos</h1>

      <button class="refresh" @click="refresh" :disabled="store.loading">
        {{ store.loading ? "Cargando..." : "Actualizar" }}
      </button>
    </header>

    <p v-if="store.error" class="error">Error: {{ store.error }}</p>
    <p v-else-if="store.loading" class="loading">Cargando favoritos...</p>
    <div v-else-if="favorites.length === 0" class="no-favs">
      💙 Aún no tienes restaurantes en favoritos
      <br />
      ¡Explora y agrega algunos!
    </div>
    <div v-else class="grid">
      <RestaurantCard v-for="r in favorites" :key="r.id || r._id" :restaurant="r" />
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRestaurantsStore } from "../stores/restaurants.js";
import { useAuth } from "../stores/auth.js";
import RestaurantCard from "../components/RestaurantCard.vue";

const store = useRestaurantsStore();
const auth = useAuth();
onMounted(() => {
  if (!store.list || store.list.length === 0) {
    store.fetchAll();
  }
});
const favorites = computed(() => {
  const favIds = auth.user?.favorites || [];
  return store.list.filter(
    r => favIds.includes(r._id || r.id)
  );
});

function refresh() {
  store.fetchAll();
}
</script>

<style scoped>
.page {
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
}

.page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
}

.refresh {
  padding: 0.5rem 0.9rem;
  border: 1px solid #5b14ff;
  border-radius: 0.6rem;
  background: #5b14ff;
  cursor: pointer;
}

.refresh[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading,
.error,
.empty {
  padding: 0.75rem 1rem;
  border-radius: 0.6rem;
  background: #f9fafb;
}

.error {
  background: #fff1f2;
  color: #b91c1c;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

.no-favs {
  margin-top: 1rem;
  padding: 1.2rem 1rem;
  background: #e0f2fe;
  border: 1px solid #38bdf8;
  color: #0369a1;
  font-size: 1rem;
  border-radius: .75rem;
  text-align: center;
  grid-column: 1 / -1;
}
</style>
