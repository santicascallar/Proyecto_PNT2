<template>
  <section class="container" style="max-width:520px;">
    <h2 class="section-title">Crear cuenta</h2>

    <form class="card" style="padding:1rem; display:grid; gap:.6rem" @submit.prevent="onSubmit">
      <input v-model.trim="name" class="input" placeholder="Nombre" required />
      <input v-model.trim="email" class="input" placeholder="Email" type="email" required />
      <input v-model="password" class="input" placeholder="Contraseña" type="password" minlength="4" required />

      <button :disabled="auth.loading" style="margin-top:.4rem;">
        {{ auth.loading ? 'Registrando…' : 'Registrar' }}
      </button>

      <p v-if="auth.error" class="muted" style="color:#ffb4b4;">{{ auth.error }}</p>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../stores/auth'

const router = useRouter()
const auth = useAuth()
const name = ref('')
const email = ref('')
const password = ref('')

async function onSubmit () {
  await auth.register({ name: name.value, email: email.value, password: password.value })
  if (auth.user) router.push('/perfil')
}
</script>