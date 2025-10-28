<template>
  <section class="container">
    <h2 class="section-title">Mi perfil</h2>
    <form class="form card" style="padding:1rem; max-width:560px;">
      <label>Nombre <input class="input" placeholder="Tu nombre" /></label>
      <label>Contacto <input class="input" placeholder="Email o teléfono" /></label>
      <label>Alergias <input class="input" placeholder="Alergias alimentarias" /></label>
      <label>Necesidades especiales <input class="input" placeholder="Opcional" /></label>
      <button style="margin-top:.5rem;">Guardar</button>
    </form>
  </section>
</template>

<style scoped>
.form { display: grid; gap: .6rem; }
</style>