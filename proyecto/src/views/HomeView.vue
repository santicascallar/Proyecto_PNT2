<template>
  <main class="home">
    <section class="hero">
      <div class="hero__inner">
        <div class="search-card">
          <h1 class="search-card__title">
            Encontrá lugares para comer con ReservaFácil
          </h1>
          <p class="search-card__subtitle">
            Descubrí restaurantes y mesas que se adaptan a tu plan de hoy.
          </p>
          <form class="search-form" @submit.prevent="onSearch">
            <label class="fgroup">
              <span>Nombre del restaurant</span>
              <input v-model="term" type="text" placeholder="Ej: Don Julio" />
            </label>
            <label class="fgroup">
              <span>Zona</span>
              <input v-model="zona" type="text" placeholder="Ej: Palermo" />
            </label>
            <button type="submit" class="btn-primary">Buscar</button>
          </form>
        </div>
        <div class="hero__map">
          <Map :restaurants="restaurantsWithGeo" @select="openModal" />

        </div>
      </div>
    </section>
    <section class="highlights container">
      <article class="card">
        <div class="ico">🛡️</div>
        <h3>La ventaja de la flexibilidad</h3>
        <p>
          Gracias a las estancias con cancelación flexible, es más fácil
          reprogramar tu salida si cambia el plan.
        </p>
      </article>

      <article class="card">
        <div class="ico">🍽️</div>
        <h3>Muchos restaurantes activos</h3>
        <p>
          Sumate a miles de comensales que encontraron mesa en los mejores
          restaurantes de tu ciudad.
        </p>
      </article>

      <article class="card">
        <div class="ico">🎯</div>
        <h3>Filtros para vos</h3>
        <p>
          Elegí por tipo de cocina, rango de precios, distancia y horarios
          disponibles para encontrar tu mesa ideal.
        </p>
      </article>
    </section>
    <section class="faq container">
      <h2>Respondemos tus preguntas</h2>
      <ul class="faq-list">
        <li v-for="(q, i) in faqs" :key="i" class="faq-item" :class="{ open: openIndex === i }">
          <button class="faq-btn" @click="toggle(i)">
            <span>{{ q.q }}</span>
            <span class="chev" :class="{ open: openIndex === i }">▾</span>
          </button>
          <div class="faq-panel" v-show="openIndex === i">
            <p>{{ q.a }}</p>
          </div>
        </li>
      </ul>
    </section>
  </main>
  <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
    <div class="modal">
      <RestaurantCard :restaurant="selectedRestaurant" />

      <div class="modal-actions">
        <button @click="showModal = false">Cerrar</button>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import Map from "@/components/Map.vue";
import * as api from "@/services/api.js";
import RestaurantCard from "@/components/RestaurantCard.vue";

const router = useRouter();
const term = ref("");
const people = ref(2);
const date = ref("");
const zona = ref("");
const selectedRestaurant = ref(null);
const showModal = ref(false);

const restaurants = ref([]);

onMounted(async () => {
  try {
    const data = await api.getRestaurants();
    restaurants.value = Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("Error cargando restaurantes:", e);
  }
});

const coordsByName = {
  "Casa Bella": { lat: -34.6037, lng: -58.3816 },
  "Sabor Local": { lat: -34.603, lng: -58.44 },
  "The Vegan Spot": { lat: -34.6, lng: -58.38 },
  "Sushi Hana": { lat: -34.59, lng: -58.39 },
  "Taco Town": { lat: -34.61, lng: -58.37 },
};

const restaurantsWithGeo = computed(() =>
  restaurants.value
    .map((r) => {
      const loc = r.location || coordsByName[r.name];
      return loc ? { ...r, location: loc } : r;
    })
    .filter((r) => r.location && typeof r.location.lat === "number")
);
function onSearchByName() {
  const t = term.value.trim().toLowerCase();

  const matches = restaurants.value.filter(r =>
    r.name.toLowerCase().includes(t)
  );

  if (matches.length === 1) {
    const id = matches[0]._id || matches[0].id;
    return router.push(`/restaurantes/${id}`);
  }

  router.push({
    path: "/restaurantes",
    query: {
      name: term.value,
      people: people.value,
      date: date.value
    }
  });
}
function onSearchByZona() {
  const z = zona.value.trim().toLowerCase();
  return router.push(`/restaurantes/zona/${zona.value}`);
}

function onSearch() {
  if (zona.value.trim() !== "") {
    return onSearchByZona();
  }

  return onSearchByName();
}


function openModal(r) {
  selectedRestaurant.value = r;
  showModal.value = true;
}

function toggle(i) {
  openIndex.value = openIndex.value === i ? -1 : i;
}
</script>

<style scoped>
.home {
  color: #e6eefc;
  background: #0b0f16;
  min-height: 100vh;
}

.hero {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

.hero__inner {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 1rem;
  max-width: 1280px;
  width: 100%;
}

.search-card {
  background: rgba(17, 24, 39, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(6px);
}

.search-card__title {
  font-size: 1.8rem;
  margin: 0 0 0.5rem 0;
}

.search-card__subtitle {
  color: #a4b0be;
  margin-bottom: 1rem;
}

.fgroup {
  display: grid;
  gap: 0.3rem;
}

input {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: 0.6rem;
  color: #e6eefc;
}

.btn-primary {
  background: #2f7df6;
  border: none;
  border-radius: 10px;
  padding: 0.6rem;
  color: white;
  font-weight: 600;
  margin-top: 0.5rem;
  cursor: pointer;
}


.highlights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  max-width: 1280px;
  margin: 2rem auto;
}

.card {
  background: #111827;
  border-radius: 14px;
  padding: 1.25rem;
  color: #e6eefc;
}

.faq h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.faq-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.75rem;
}

.faq-item {
  background: #111827;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.faq-btn {
  width: 100%;
  padding: 1rem 1.25rem;
  background: transparent;
  color: #e6eefc;
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.faq-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}

.chev {
  transition: transform 0.25s ease;
}

.chev.open {
  transform: rotate(180deg);
}

.faq-panel {
  padding: 0 1.25rem 1rem;
  color: #a4b0be;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal {
  background: #1b1b1b;
  width: 90%;
  max-width: 420px;
  padding: 1rem;
  border-radius: 16px;
  box-shadow: 0 0 20px rgba(0, 0, 0, .4);
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.modal-actions button {
  background: #3b82f6;
  border: none;
  border-radius: 10px;
  padding: .6rem 1rem;
  color: white;
  cursor: pointer;
}

.modal-actions button:hover {
  background: #2563eb;
}
</style>