  <template>
    <form class="search" @submit.prevent="onSearch">
      <input class="input" v-model="term" placeholder="Buscar por nombre o tipo de comida" @input="onInput" />
      <input class="input" v-model.number="people" type="number" min="1" placeholder="Personas" />
      <input class="input" v-model="date" type="datetime-local" />
      <button class="btn">Buscar</button>
    </form>
  </template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['search'])
const term = ref('')
const people = ref(2)
const date = ref('')

let tm
function onInput() {
  clearTimeout(tm)
  tm = setTimeout(() => emit('search', { term: term.value, people: people.value, date: date.value }), 250)
}
function onSearch() {
  emit('search', { term: term.value, people: people.value, date: date.value })
}
</script>

<style scoped>
.search {
  display: grid;
  grid-template-columns: 1.6fr .8fr 1.1fr auto;
  gap: .5rem;
}

.btn {
  padding: .65rem 1rem;
}

@media (max-width: 820px) {
  .search {
    grid-template-columns: 1fr;
  }
}
</style>