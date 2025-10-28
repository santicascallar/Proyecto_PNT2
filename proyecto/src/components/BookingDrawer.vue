<template>
  <dialog ref="dlg">
    <form @submit.prevent="submit">
      <h3>Reservar en {{ restaurant?.name }}</h3>
      <label>Fecha y hora <input v-model="payload.datetime" type="datetime-local" required class="input"></label>
      <label>Personas <input v-model.number="payload.people" type="number" min="1" required class="input"></label>
      <div class="row">
        <button type="submit">Confirmar</button>
        <button type="button" @click="close" class="ghost">Cancelar</button>
      </div>
    </form>
  </dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({ open: Boolean, restaurant: Object })
const emit = defineEmits(['close','confirm'])
const dlg = ref(null)
const payload = ref({ datetime: '', people: 2 })

watch(() => props.open, (v) => { v ? dlg.value?.showModal() : dlg.value?.close() })
function close(){ emit('close') }
function submit(){ emit('confirm', { ...payload.value, restaurantId: props.restaurant.id }) }
</script>

<style scoped>
dialog{
  border: none; border-radius: 16px; padding: 1rem 1rem 1.2rem;
  background: rgba(17,18,23,.9); color: var(--text);
  box-shadow: var(--shadow); backdrop-filter: blur(8px);
}
form { display: grid; gap: .7rem; min-width: 320px; }
.row{ display:flex; gap:.5rem; }
.ghost{
  background: transparent; color: var(--text); border:1px solid rgba(255,255,255,.2);
}
</style>