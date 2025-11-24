<template>
  <article class="card item">
    <div class="thumb">
      <img
        :src="imageSrc"
        :alt="restaurant.name"
        loading="lazy"
        @error="onImgError"
      />
    </div>
    <div class="body">
      <h3>{{ restaurant.name }}</h3>
      <p class="muted">
        {{ restaurant.cuisine }}
      </p>
      <p class="muted">
        {{ restaurant.rating}}⭐
      </p>
      <p class="muted">
        {{ restaurant.zona }}
      </p>

      <div class="meta">
        <span class="tag">Cerca tuyo</span>
        <span class="tag">Hoy</span>
      </div>

      <div class="actions">
        <router-link :to="`/restaurantes/${restaurant._id || restaurant.id}`" class="ghost">
          Ver detalle
        </router-link>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  restaurant: { type: Object, required: true }
});
const FALLBACK = new URL("../assets/restaurant-placeholder.jpg", import.meta.url).href;
const imageSrc = computed(() =>
  props.restaurant.imageUrl ||
  props.restaurant.cover ||
  props.restaurant.image ||
  FALLBACK
);
function onImgError(e) {
  e.target.src = FALLBACK;
}
</script>

<style scoped>
.item {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: var(--radius);
  background: #1b1b1b;
  color: #fff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
}

.thumb {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.body {
  padding: 1rem;
  display: grid;
  gap: 0.5rem;
}

h3 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 600;
}

.muted {
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.95rem;
}

.meta {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.tag {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  font-size: 0.8rem;
}

.actions {
  margin-top: 0.25rem;
  display: flex;
  gap: 0.5rem;
}

.ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 0.9rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: transparent;
  color: #fff;
  transition: all 0.2s;
}

.ghost:hover {
  border-color: rgba(255, 255, 255, 0.4);
}

button {
  background: var(--accent, #3b82f6);
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 0.6rem 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover {
  background: #2563eb;
}
</style>