<template>
  <section class="map-wrapper">
    <h2 class="map-title">Mapa de Restaurantes</h2>
    <div id="mapContainer"></div>
  </section>
</template>

<script>
import 'leaflet/dist/leaflet.css';
import 'leaflet';
import { onMounted } from 'vue';

export default {
  setup() {
    onMounted(() => {
      const map = L.map('mapContainer').setView([-38.4161, -63.6167], 5); // Coordenadas y zoom inicial
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      //agregar marcadores y otras funcionalidades
      L.marker([-34.6037, -58.3816])
        .addTo(map)
        .bindPopup('Buenos Aires, Argentina 🇦🇷')
        .openPopup();
    });

    return {};
  }
}
</script>

<style scoped>
/* Contenedor general */
.map-wrapper {
  background: transparent; /* 🔹 Sin fondo negro */
  padding: 1rem;
  border-radius: 16px;
  margin: 2rem auto;
  width: 90%;
  max-width: 1100px;
}

/* Título */
.map-title {
  text-align: center;
  font-size: 1.4rem;
  margin-bottom: 1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #1e88e5; /* Azul moderno */
}

/* Contenedor del mapa */
#mapContainer {
  width: 100%;
  height: 500px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1); /* Borde sutil */
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08); /* Sombra suave */
}

/* Controles del mapa */
.leaflet-control {
  background: rgba(255, 255, 255, 0.9) !important;
  border-radius: 8px !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.leaflet-bar a {
  color: #333 !important;
}

/* Popup */
.leaflet-popup-content-wrapper {
  background: #fff !important;
  color: #222 !important;
  border-radius: 8px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.leaflet-popup-tip {
  background: #fff !important;
}
</style>