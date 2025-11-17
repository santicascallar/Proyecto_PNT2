<template>
  <section class="page">
    <header class="page__header">
      <h1 class="title">Restaurantes en {{ zona }}</h1>
    </header>

    <p v-if="store.error" class="error">Error: {{ store.error }}</p>
    <p v-else-if="store.loading" class="loading">Cargando restaurantes...</p>

    <div v-else class="grid">
      <RestaurantCard
        v-for="r in filtered"
        :key="r._id || r.id"
        :restaurant="r"
      />

      <p v-if="filtered.length === 0" class="empty">
        No hay restaurantes en esta zona.
      </p>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useRestaurantsStore } from "../stores/restaurants";
import RestaurantCard from "../components/RestaurantCard.vue";

const store = useRestaurantsStore();
const route = useRoute();
const zona = route.params.zona;

onMounted(() => {
  if (!store.list.length) store.fetchAll();
});

const filtered = computed(() =>
  store.list.filter(r =>
    r.zona?.toLowerCase() === zona.toLowerCase()
  )
);
</script>

<style scoped>
.page {
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}
</style>
