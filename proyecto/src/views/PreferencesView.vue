<template>
  <section class="container">
    <h2 class="section-title">Preferencias</h2>
    <form class="form card" style="padding:1rem; max-width:560px;">
      <label>Horarios habituales
        <select class="input">
          <option>Noche</option>
          <option>Mediodía</option>
          <option>Mañana</option>
        </select>
      </label>
      <label>Tipos de comida favorita
        <input class="input" placeholder="Ej. Japonesa, Vegana" />
      </label>
      <button style="margin-top:.5rem;">Guardar</button>
    </form>
  </section>
</template>

<style scoped>
.form { display: grid; gap: .6rem; }
</style>