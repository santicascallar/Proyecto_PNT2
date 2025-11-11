<template>
  <section class="filters">
    <label>
      Tipo de comida
      <select v-model="local.cuisine">
        <option value="">Todas</option>
        <option v-for="c in cuisines" :key="c" :value="c">{{ c }}</option>
      </select>
    </label>

    <label>
      Opciones
      <select v-model="local.option">
        <option value="">Cualquiera</option>
        <option value="pet-friendly">Pet-friendly</option>
        <option value="terraza">Terraza</option>
        <option value="accesible">Accesibilidad</option>
      </select>
    </label>

    <label>
      Precio
      <select v-model="local.price">
        <option value="">Todos</option>
        <option>$</option>
        <option>$$</option>
        <option>$$$</option>
      </select>
    </label>
  </section>
</template>


<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Object, default: () => ({ cuisine: '', option: '', price: '' }) }
})
const emit = defineEmits(['update:modelValue'])


const local = reactive({ ...props.modelValue })


watch(() => props.modelValue, (v) => Object.assign(local, v), { deep: true })


watch(local, (v) => emit('update:modelValue', { ...v }), { deep: true })
</script>

<style scoped>

/*prueba fondo desplegable*/ 
select{
appearance: none;
-webkit-appearance: none;
-moz-appearance: none;
background-color: rgba(30, 30, 30, 0.95);
color:white;
border: 1px solid rgba(255, 255, 255, 0.2);
border-radius: 8px;
padding: 0.6rem 1rem;
font-size: 1rem;
cursor: pointer;
}

select option {
background-color: #1e1e1e;
color: white;
}

.filters { display: flex; gap: 1rem; flex-wrap: wrap; margin: .5rem 0 1rem; }
label { display: flex; flex-direction: column; gap: .25rem; }
select {
  padding: .6rem .8rem; border-radius:10px;
  background: rgba(255,255,255,.04); color: var(--text);
  border: 1px solid rgba(255,255,255,.12);
}
</style>