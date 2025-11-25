<template>
  <section class="container">
    <h2 class="section-title">Mi perfil</h2>

    <form class="form card" style="padding:1rem; max-width:560px;" @submit.prevent="onSave">
      <label>
        Nombre
        <input class="input" v-model="name" placeholder="Tu nombre" required />
      </label>

      <label>
        Contacto
        <br></br>
        <input class="input" v-model="phone" placeholder="Teléfono" type="phone" required />
      </label>

      <button :disabled="auth.loading" style="margin-top:.5rem;">
        {{ auth.loading ? "Guardando..." : "Guardar" }}
      </button>

      <p v-if="auth.error" style="color:#ff8a8a">{{ auth.error }}</p>
      <p v-if="success" style="color:#4caf50">Datos actualizados</p>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../stores/auth.js'
import { updateUser } from '../services/users.api.js'

const auth = useAuth()
const name = ref(auth.user?.name || "")
const phone = ref(auth.user?.phone || "")

async function onSave() {
  try {
    const id = auth.user?._id || auth.user?.id

    if (!id) {
      console.error("El usuario no tiene ID guardado en el store")
      return
    }

    const updated = await updateUser(id, {
      name: name.value,
      phone: phone.value
    })

    auth.user.name = updated.name
    auth.user.phone = updated.phone

    alert("Perfil actualizado")
  } catch (e) {
    console.error(e)
  }
}

</script>

<style scoped>
.form {
  display: grid;
  gap: .6rem;
}
</style>