<template>
  <main class="home">
    <!-- HERO -->
    <section class="hero">
      <div class="hero__inner">
        <!-- Tarjeta de búsqueda -->
        <div class="search-card">
          <h1 class="search-card__title">
            Encontrá lugares para comer con ReservaFácil
          </h1>
          <p class="search-card__subtitle">
            Descubrí restaurantes y mesas que se adaptan a tu plan de hoy.
          </p>

          <!-- Formulario de búsqueda -->
          <form class="search-form" @submit.prevent="onSearch">
            <label class="fgroup">
              <span>Ubicación</span>
              <input v-model="term" type="text" placeholder="En la zona" />
            </label>

            <div class="grid-2">
              <label class="fgroup">
                <span>Fecha</span>
                <input v-model="date" type="date" />
              </label>
              <label class="fgroup">
                <span>Personas</span>
                <input v-model.number="people" type="number" min="1" />
              </label>
            </div>

            <button type="submit" class="btn-primary">Buscar</button>
          </form>
        </div>

        <!-- Mapa -->
        <div class="hero__map">
          <Map :restaurants="restaurantsWithGeo" @select="goToRestaurant" />
        </div>
      </div>
    </section>

    <!-- BENEFICIOS -->
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

    <!-- PREGUNTAS FRECUENTES -->
    <section class="faq container">
      <h2>Respondemos tus preguntas</h2>
      <ul class="faq-list">
        <li
          v-for="(q, i) in faqs"
          :key="i"
          class="faq-item"
          :class="{ open: openIndex === i }"
        >
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
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import Map from "@/components/Map.vue";
import * as api from "@/services/api.js";

const router = useRouter();
const term = ref("");
const people = ref(2);
const date = ref("");

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

function onSearch() {
  router.push({
    path: "/restaurantes",
    query: {
      term: term.value || "",
      people: people.value || 2,
      date: date.value || "",
    },
  });
}

function goToRestaurant(r) {
  const id = r._id || r.id;
  if (id) router.push(`/restaurantes/${id}`);
}

/* Preguntas frecuentes */
const openIndex = ref(-1);
const faqs = ref([
  {
    q: "¿Cómo funciona ReservaFácil?",
    a: "Buscás, filtrás por fecha/personas y reservás tu mesa en segundos.",
  },
  {
    q: "¿Cómo aprovecho los filtros de búsqueda?",
    a: "Podés filtrar por tipo de cocina, precio, cercanía y horarios disponibles.",
  },
  {
    q: "¿Necesito confirmar con el restaurante?",
    a: "No. Te enviamos la confirmación y el restaurante recibe tu reserva al instante.",
  },
  {
    q: "¿Puedo cancelar mi reserva?",
    a: "Sí, según políticas del restaurante. En muchos casos hay cancelación flexible.",
  },
]);

function toggle(i) {
  openIndex.value = openIndex.value === i ? -1 : i;
}
</script>

<style scoped>
/* === ESTRUCTURA GENERAL === */
.home {
  color: #e6eefc;
  background: #0b0f16;
  min-height: 100vh;
}

/* === HERO === */
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

/* Formulario */
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

/* === FAQ === */
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
</style>