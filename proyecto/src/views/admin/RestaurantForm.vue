<template>
  <section class="form-container">
    <h2 class="form-title">Agregar Restaurante</h2>

    <form class="form-card" @submit.prevent="submitForm">
      <label>Nombre</label>
      <input v-model="form.name" required />

      <label>Dirección</label>
      <input v-model="form.address" required />

      <label>Cocina</label>
      <input v-model="form.cuisine" />

      <label>Rating</label>
      <input type="number" step="0.1" min="0" max="5" v-model.number="form.rating" />

      <label>Imagen URL</label>
      <input v-model="form.imageUrl" />

      <label>Latitud</label>
      <input type="number" step="0.000001" v-model.number="form.lat" required />

      <label>Longitud</label>
      <input type="number" step="0.000001" v-model.number="form.lng" required />

      <label>Zona</label>
      <input v-model="form.zone" />

      <label>Descripción</label>
      <textarea v-model="form.description"></textarea>

      <button class="btn-submit" type="submit">Crear</button>
    </form>

    <p v-if="message" class="msg-success">{{ message }}</p>
    <p v-if="error" class="msg-error">{{ error }}</p>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { createRestaurant } from "../../services/restaurants.api.js";

const message = ref("");
const error = ref("");

const form = ref({
  name: "",
  address: "",
  cuisine: "",
  rating: null,
  //priceRange: "",
  imageUrl: "",
  zone: "",
  lat: null,
  lng: null,
  description: "",
});

const submitForm = async () => {
  message.value = "";
  error.value = "";

  try {
    const payload = {
      name: form.value.name,
      address: form.value.address,
      cuisine: form.value.cuisine,
      rating: form.value.rating,
      imageUrl: form.value.imageUrl,
      location: {
        zone: form.value.zone,
        lat: form.value.lat,
        lng: form.value.lng
      },
      description: form.value.description,
    };


    await createRestaurant(payload);

    message.value = "Restaurante creado exitosamente";

    Object.keys(form.value).forEach(k => (form.value[k] = ""));
  } catch (e) {
    error.value = "Error al crear restaurante";
    console.error(e);
  }
};
</script>

<style scoped>
.form-container {
  max-width: 700px;
  margin: 2rem auto;
  padding: 1rem;
}

.form-title {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #ffffff;
}

.form-card {
  background: #ffffffee;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  font-weight: 600;
  color: #333;
  margin-bottom: -0.5rem;
}

input,
textarea {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  background: #000000;
  transition: border 0.2s, background 0.2s;
}

input:focus,
textarea:focus {
  border-color: #3b82f6;
  background: #000000;
  outline: none;
}

textarea {
  min-height: 120px;
  resize: vertical;
}

.btn-submit {
  padding: 0.8rem;
  border: none;
  border-radius: 10px;
  background: #2563eb;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.btn-submit:hover {
  background: #1d4ed8;
}

.btn-submit:active {
  transform: scale(0.97);
}

.msg-success {
  color: green;
  text-align: center;
  margin-top: 1rem;
}

.msg-error {
  color: red;
  text-align: center;
  margin-top: 1rem;
}
</style>