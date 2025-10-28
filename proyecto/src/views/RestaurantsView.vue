<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRestaurants } from '../stores/restaurants'
import RestaurantCard from '../components/RestaurantCard.vue'
import FiltersPanel from '../components/FiltersPanel.vue'
import BookingDrawer from '../components/BookingDrawer.vue'

const store = useRestaurants()
const route = useRoute()
const filters = ref({ cuisine:'', price:'', option:'' })
const open = ref(false)
const selected = ref(null)

onMounted(() => { store.fetch() })   

const list = computed(() => {
  const term = (route.query.term || '').toString().toLowerCase()
  return store.list.filter(r => {
    const matchesTerm = !term || r.name.toLowerCase().includes(term) || r.cuisine.toLowerCase().includes(term)
    const matchesCuisine = !filters.value.cuisine || r.cuisine === filters.value.cuisine
    const matchesPrice = !filters.value.price || r.price === filters.value.price
    return matchesTerm && matchesCuisine && matchesPrice
  })
})

function openBook(r){ selected.value=r; open.value=true }
function confirm(){ open.value=false; alert('Reserva registrada (mock)') }
</script>

<template>
  <section class="container">
    <h2 class="section-title">Restaurantes</h2>
    <FiltersPanel v-model="filters" />

    <p v-if="store.loading" class="muted">Cargando…</p>
    <p v-else-if="store.error">{{ store.error }}</p>

    <!-- TEST RÁPIDO: descomenta esta línea para ver el tamaño -->
    <!-- <pre>items: {{ store.list.length }}</pre> -->

    <div v-else class="grid">
      <RestaurantCard v-for="r in list" :key="r.id" :restaurant="r" @book="openBook" />
    </div>

    <BookingDrawer :open="open" :restaurant="selected" @close="open=false" @confirm="confirm" />
  </section>
</template>