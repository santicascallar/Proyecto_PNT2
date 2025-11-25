

<template>
  <main class="home">
    <section class="hero">
      <div class="hero__inner">
        <div class="search-card glass">
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
            <label class="fgroup">
              <span>Tipo de comida</span>
              <input v-model="foodType" type="text" placeholder="Ej: Japonesa" />
            </label>
            <div class="rating-row">
              <span>Calificación mínima</span>
              <v-rating
                v-model="rating"
                half-increments
                hover
                length="5"
                size="28"
                active-color="primary"
              />
            </div>
          </form>
        </div>
        <div class="hero__map glass">
          <Map
            :restaurants="filteredRestaurants || restaurantsWithGeo"
            @select="openModal"
          />
        </div>
      </div>
    </section>

 
    <section v-if="promoRestaurant" class="promo container">
      <div class="promo__card glass">
        <div class="promo__header">
          <div>
            <h2>Restaurante en promoción</h2>
            <p class="promo__subtitle">
              Este restaurante tuvo pocas reservas últimamente. ¡Aprovechá y descubrilo!
            </p>
          </div>
          <span class="promo__badge">📉 Pocas reservas</span>
        </div>

        <RestaurantCard :restaurant="promoRestaurant" />
      </div>
    </section>

   
    <section class="highlights container">
      <article class="card glass">
        <div class="ico">🛡️</div>
        <h3>La ventaja de la flexibilidad</h3>
        <p>
          Gracias a las estancias con cancelación flexible, es más fácil
          reprogramar tu salida si cambia el plan.
        </p>
      </article>

      <article class="card glass">
        <div class="ico">🍽️</div>
        <h3>Muchos restaurantes activos</h3>
        <p>
          Sumate a miles de comensales que encontraron mesa en los mejores
          restaurantes de tu ciudad.
        </p>
      </article>

      <article class="card glass">
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
        <li
          v-for="(q, i) in faqs"
          :key="i"
          class="faq-item glass"
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

    
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal glass-strong">
        <RestaurantCard :restaurant="selectedRestaurant" />
        <div class="modal-actions">
          <button @click="showModal = false">Cerrar</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Map from "@/components/Map.vue";
import * as api from "@/services/restaurants.api.js";
import RestaurantCard from "@/components/RestaurantCard.vue";
import { useRouter } from "vue-router";

const term = ref("");
const zona = ref("");
const foodType = ref("");
const rating = ref(null);

const restaurants = ref([]);
const filteredRestaurants = ref(null);
const selectedRestaurant = ref(null);
const showModal = ref(false);

const promoRestaurant = ref(null);


const coordsByName = {};


const faqs = ref([
  {
    q: "¿Cómo funciona ReservaFácil?",
    a: "Buscás un restaurante, elegís día y horario, y confirmás la reserva en pocos pasos.",
  },
  {
    q: "¿Tiene costo usar la plataforma?",
    a: "No, la plataforma es gratuita para los usuarios que realizan reservas.",
  },
  {
    q: "¿Puedo cancelar una reserva?",
    a: "Sí, podés cancelar desde la sección Mis reservas, respetando las políticas del restaurante.",
  },
]);

const openIndex = ref(-1);

onMounted(async () => {
  try {
    const data = await api.getRestaurants();
    restaurants.value = Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("Error cargando restaurantes:", e);
  }

  try {
    promoRestaurant.value = await api.getLeastBookedRestaurant();
  } catch (e) {
    console.error("Error cargando restaurante promocionado:", e);
  }
});

const restaurantsWithGeo = computed(() =>
  restaurants.value
    .map((r) => {
      const loc = r.location || coordsByName[r.name];
      return loc ? { ...r, location: loc } : r;
    })
    .filter((r) => r.location && typeof r.location.lat === "number")
);

function onSearch() {
  const name = term.value.trim().toLowerCase();
  const searchZone = zona.value.trim().toLowerCase();
  const type = foodType.value.trim().toLowerCase();
  const selectedRating = rating.value ?? 0;

  let results = [...restaurants.value];

  if (name) {
    results = results.filter((r) =>
      r.name?.toLowerCase().includes(name)
    );
  }

  if (searchZone) {
    results = results.filter((r) =>
      r.zone?.toLowerCase().includes(searchZone)
    );
  }

  if (type) {
    results = results.filter((r) =>
      r.cuisine?.toLowerCase().includes(type)
    );
  }

  if (selectedRating > 0) {
    results = results.filter((r) => (r.rating || 0) >= selectedRating);
  }

  filteredRestaurants.value = results;
}

function openModal(r) {
  selectedRestaurant.value = r;
  showModal.value = true;
}

function toggle(i) {
  openIndex.value = openIndex.value === i ? -1 : i;
}

watch(term, onSearch);
watch(zona, onSearch);
watch(foodType, onSearch);
watch(rating, onSearch);
</script>

<style scoped>


.home {
  min-height: 100vh;
  color: #e6ecff;
  background:
    radial-gradient(circle at top left, rgba(129, 140, 248, 0.25), transparent 55%),
    radial-gradient(circle at bottom right, rgba(45, 212, 191, 0.18), transparent 50%),
    linear-gradient(180deg, #030712 0%, #020617 55%, #020617 100%),
    url("@/assets/home-bg.jpg") center/cover fixed no-repeat;
  padding: 3rem 1.5rem 4rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}



.hero {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.hero__inner {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  gap: 1.5rem;
  max-width: 1200px;
  width: 100%;
}

.search-card {
  padding: 1.75rem;
}

.search-card__title {
  font-size: 1.9rem;
  font-weight: 650;
  letter-spacing: 0.02em;
  margin: 0 0 0.5rem 0;
}

.search-card__subtitle {
  color: #9ca3af;
  margin-bottom: 1.25rem;
}

.search-form {
  display: grid;
  gap: 0.9rem;
}

.fgroup {
  display: grid;
  gap: 0.35rem;
  font-size: 0.9rem;
}

.fgroup span {
  color: #9ca3af;
}

input {
  background: rgba(3, 7, 18, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.4);
  border-radius: 12px;
  padding: 0.6rem 0.8rem;
  color: #e5e7eb;
  font-size: 0.95rem;
  outline: none;
  transition: border 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}

input::placeholder {
  color: #6b7280;
}

input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.5);
  background: rgba(15, 23, 42, 0.95);
}

.rating-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.9rem;
  color: #9ca3af;
}



.hero__map {
  padding: 0.75rem;
  display: flex;
  align-items: stretch;
}

.hero__map :deep(.leaflet-container) {
  border-radius: 18px;
  overflow: hidden;
}


.promo {
  margin-top: 0.5rem;
  margin-bottom: 2rem;
}

.promo__card {
  padding: 1.5rem 1.5rem 1.25rem;
}

.promo__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.promo__subtitle {
  color: #9ca3af;
  margin-top: 0.25rem;
}

.promo__badge {
  font-size: 0.8rem;
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(248, 113, 113, 0.4);
  color: #fecaca;
  white-space: nowrap;
}



.highlights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.card {
  padding: 1.3rem 1.4rem;
}

.card .ico {
  font-size: 1.3rem;
  margin-bottom: 0.4rem;
}

.card h3 {
  margin: 0 0 0.35rem;
  font-size: 1.05rem;
}

.card p {
  margin: 0;
  color: #9ca3af;
  font-size: 0.95rem;
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
  gap: 0.8rem;
}

.faq-item {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid transparent;
  transition: border 0.2s ease, transform 0.15s ease, box-shadow 0.15s ease;
}

.faq-item.open {
  border-color: rgba(99, 102, 241, 0.55);
  box-shadow: 0 14px 35px rgba(15, 23, 42, 0.65);
  transform: translateY(-1px);
}

.faq-btn {
  width: 100%;
  padding: 1rem 1.3rem;
  background: transparent;
  color: #e5e7eb;
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-size: 0.98rem;
}

.faq-btn:hover {
  background: rgba(15, 23, 42, 0.9);
}

.chev {
  transition: transform 0.25s ease;
}

.chev.open {
  transform: rotate(180deg);
}

.faq-panel {
  padding: 0 1.3rem 1rem;
  color: #9ca3af;
  font-size: 0.95rem;
}



.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(3, 7, 18, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal {
  width: 90%;
  max-width: 440px;
  padding: 1.1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.85rem;
}

.modal-actions button {
  background: #6366f1;
  border: none;
  border-radius: 999px;
  padding: 0.5rem 1.1rem;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s ease, transform 0.1s ease;
}

.modal-actions button:hover {
  background: #4f46e5;
  transform: translateY(-1px);
}



.glass {
  background: radial-gradient(circle at top left, rgba(148, 163, 184, 0.22), transparent 55%),
    linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.85));
  border-radius: 20px;
  border: 1px solid rgba(148, 163, 184, 0.38);
  box-shadow:
    0 18px 45px rgba(15, 23, 42, 0.85),
    0 0 0 1px rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.glass-strong {
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 0.94));
  border-radius: 22px;
  border: 1px solid rgba(148, 163, 184, 0.45);
  box-shadow:
    0 22px 60px rgba(15, 23, 42, 0.95),
    0 0 0 1px rgba(15, 23, 42, 1);
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
}



@media (max-width: 900px) {
  .home {
    padding: 2rem 1rem 3rem;
  }

  .hero__inner {
    grid-template-columns: 1fr;
  }

  .hero__map {
    min-height: 320px;
  }

  .promo__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .rating-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>