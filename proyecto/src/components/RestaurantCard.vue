<template>
  <article class="card item">
    <div class="thumb">
      <img :src="restaurant.cover" :alt="restaurant.name" loading="lazy" />
    </div>

    <div class="body">
      <h3>{{ restaurant.name }}</h3>
      <p class="muted">{{ restaurant.cuisine }} • {{ restaurant.price }} • ⭐ {{ restaurant.rating }}</p>

      <div class="meta">
        <span class="tag">📍 Cerca tuyo</span>
        <span class="tag">🕒 Hoy</span>
      </div>

      <div class="actions">
        <router-link :to="`/restaurantes/${restaurant.id}`" class="ghost">Ver detalle</router-link>
        <button @click="$emit('book', restaurant)">Reservar</button>
      </div>
    </div>
  </article>
</template>

<script setup>
defineProps({ restaurant: Object })
</script>

<style scoped>

.item{
  display:flex; flex-direction:column; overflow:hidden;
  border-radius: var(--radius);
}


.thumb{
  width: 100%;
  aspect-ratio: 16 / 9;     
  overflow: hidden;
}


.thumb img{
  width: 100%; height: 100%;
  object-fit: cover; display:block;
}

/* Contenido */
.body{ padding: 1rem; display:grid; gap:.5rem; }
h3{ margin:0; font-size: 1.15rem; }
.meta{ display:flex; gap:.4rem; flex-wrap:wrap; }
.actions{ margin-top:.25rem; display:flex; gap:.5rem; }
.ghost{
  display:inline-flex; align-items:center; justify-content:center;
  padding:.6rem .9rem; border-radius:999px; border:1px solid rgba(255,255,255,.16);
}
</style>