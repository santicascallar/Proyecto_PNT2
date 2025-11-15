<template>
  <section class="page">
    <header class="page__header">
      <h1 class="title">Restaurantes</h1>
      <button class="refresh" @click="store.fetchAll" :disabled="store.loading">
        {{ store.loading ? "Cargando..." : "Actualizar" }}
      </button>
    </header>
    <p v-if="store.error" class="error">Error: {{ store.error }}</p>
    <p v-else-if="store.loading" class="loading">Cargando restaurantes...</p>
    <div v-else class="grid">
      <RestaurantCard
        v-for="r in store.list"
        :key="r.id || r._id"
        :restaurant="r"
      />
      <p v-if="store.list.length === 0" class="empty">No hay restaurantes.</p>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from "vue";
import { useRestaurantsStore } from "../stores/restaurants";
import RestaurantCard from "../components/RestaurantCard.vue";

const store = useRestaurantsStore();

onMounted(() => {
  if (!store.list || store.list.length === 0) {
    store.fetchAll();
  }
});
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
  gap: .75rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
}

.refresh {
  padding: .5rem .9rem;
  border: 1px solid #e5e7eb;
  border-radius: .6rem;
  background: #fff;
  cursor: pointer;
}
.refresh[disabled] { opacity: .6; cursor: not-allowed; }

.loading, .error, .empty {
  padding: .75rem 1rem;
  border-radius: .6rem;
  background: #f9fafb;
}

.error { background: #fff1f2; color: #b91c1c; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}
</style>