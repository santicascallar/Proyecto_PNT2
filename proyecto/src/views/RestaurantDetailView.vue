<template>
  <section v-if="r" class="container">
    <img :src="r.cover" class="hero" />
    <h2>{{ r.name }}</h2>
    <p class="muted">{{ r.cuisine }} • {{ r.price }} •  {{ r.rating }}</p>
    <p>{{ r.description }}</p>
    <button @click="book">Reservar</button>
    <BookingDrawer :open="open" :restaurant="r" @close="open=false" @confirm="confirm" />
  </section>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRestaurants } from '../stores/restaurants'
import BookingDrawer from '../components/BookingDrawer.vue'

const route = useRoute()
const store = useRestaurants()
const open = ref(false)
onMounted(() => { if (!store.list.length) store.fetch() })
const r = computed(() => store.byId(route.params.id))
function book(){ open.value = true }
function confirm(){ open.value=false; alert('Reserva OK (mock)') }
</script>

<style scoped>
.hero { width: 100%; max-height: 320px; object-fit: cover; border-radius: 12px; }
</style>