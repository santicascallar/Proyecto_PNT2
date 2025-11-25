<template>
  <dialog ref="dlg">
    <div v-if="open" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-card">
        <form @submit.prevent="submit">
          <h3>Reservar en {{ restaurant?.name }}</h3>
          <label>
            Fecha y hora
            <input v-model="payload.datetime" type="datetime-local" required class="input" :min="now">
          </label>
          <label>Personas <input v-model.number="payload.people" type="number" min="1" required class="input"></label>
          <div class="row">
            <button type="submit">Confirmar</button>
            <button type="button" @click="close" class="ghost">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({ open: Boolean, restaurant: Object })
const emit = defineEmits(['close', 'confirm'])
const dlg = ref(null)
const payload = ref({ datetime: '', people: 2 })
const now = ref("");

function updateNow() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  now.value = d.toISOString().slice(0, 16);
}

watch(() => props.open, (v) => {
  if (v) {
    updateNow();
    dlg.value?.showModal();
  } else {
    dlg.value?.close();
  }
});

function close() { emit('close') }

function submit() {
  emit('confirm', {
    ...payload.value,
    restaurantId: props.restaurant.id
  })
}
</script>


<style scoped>
dialog {
  border: none;
  border-radius: 20px;
  padding: 1.5rem 1.8rem;
  background: rgba(17, 18, 23, 0.95);
  color: var(--text);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  max-width: 90%;
}

form {
  display: grid;
  gap: .7rem;
  min-width: 320px;
}

.row {
  display: flex;
  gap: .5rem;
}

.ghost {
  background: transparent;
  color: var(--text);
  border: 1px solid rgba(255, 255, 255, .2);
}
</style>