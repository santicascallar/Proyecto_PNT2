<template>
  <div ref="el" class="map"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, watch, ref } from 'vue'
import L from 'leaflet'

const props = defineProps({
  restaurants: { type: Array, default: () => [] }
})
const emit = defineEmits(['select'])

const el = ref(null)
let map, markersLayer

onMounted(() => {
  map = L.map(el.value, {
    zoomControl: true,
    center: [-34.6037, -58.3816],
    zoom: 12
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map)

  markersLayer = L.layerGroup().addTo(map)
  renderMarkers(props.restaurants)
})

onBeforeUnmount(() => { if (map) map.remove() })

watch(() => props.restaurants, (list) => {
  renderMarkers(list)
}, { deep: true })

function renderMarkers(list) {
  if (!markersLayer) return
  markersLayer.clearLayers()
  const points = []

  list.forEach(r => {
    const loc = r?.location
    if (!loc || typeof loc.lat !== 'number' || typeof loc.lng !== 'number') return
    const m = L.marker([loc.lat, loc.lng]).addTo(markersLayer)
    m.bindPopup(r.name || 'Restaurante')
    m.on('click', () => emit('select', r))
    points.push([loc.lat, loc.lng])
  })

  if (points.length) {
    const bounds = L.latLngBounds(points)
    map.fitBounds(bounds, { padding: [30, 30] })
  }
}
</script>

<style scoped>
.map{
  width: 100%;
  height: 520px;
  border-radius: 16px;
  overflow: hidden;
}
</style>