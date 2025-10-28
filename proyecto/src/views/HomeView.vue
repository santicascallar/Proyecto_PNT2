<template>
  <section class="home">
    <div class="overlay">
      <h1>Encontrá tu mesa ideal</h1>
      <p>Buscá por zona, tipo de comida, disponibilidad y más.</p>
      <div class="search-bar">
        <input type="text" placeholder="Buscar por nombre o tipo de comida" />
        <input type="number" placeholder="2" min="1" />
        <input type="date" />
        <button>Buscar</button>
      </div>
      <div class="categories">
        <button>Italiana</button>
        <button>Japonesa</button>
        <button>Vegana</button>
        <button>Parrilla</button>
      </div>
    </div>
  </section>
  <div>
    <MapComponent />
  </div>
</template>

<script setup>
import MapComponent from '../components/Map.vue';
// aca mandamos logica de buscador 
</script>

<style scoped>
.home {
  height: 100vh;
  background-image: url('/fondo-inicio.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.overlay {
  background: rgba(0, 0, 0, 0.6);
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  color: white;
  max-width: 700px;
  width: 90%;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.search-bar {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.search-bar input, .search-bar button {
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
}

.search-bar button {
  background: linear-gradient(90deg, #4A90E2, #50E3C2);
  color: white;
  cursor: pointer;
  transition: 0.3s;
}

.search-bar button:hover {
  opacity: 0.9;
}

.categories {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.categories button {
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.25);
  color: white;
  border-radius: 20px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  transition: 0.3s;
}

.categories button:hover {
  background: rgba(255,255,255,0.3);
}
</style>