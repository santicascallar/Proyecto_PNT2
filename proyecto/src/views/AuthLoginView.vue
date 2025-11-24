<template>
  <section class="container" style="max-width:520px;">
    <h2 class="section-title">Ingresar</h2>

    <form class="card" style="padding:1rem; display:grid; gap:.6rem" @submit.prevent="onSubmit">
      <input v-model.trim="email" class="input" placeholder="Email" type="email" required />
      <input v-model="password" class="input" placeholder="Contraseña" type="password" minlength="4" required />

      <button :disabled="auth.loading" style="margin-top:.4rem;">
        {{ auth.loading ? 'Entrando…' : 'Entrar' }}
      </button>

      <p v-if="auth.error" class="muted" style="color:#ffb4b4;">{{ auth.error }}</p>
    </form>

    <p class="muted" style="margin-top:.6rem;">
      ¿No tenés cuenta? <router-link to="/registro">Crear cuenta</router-link>
    </p>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../stores/auth'

const auth = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')

async function onSubmit () {
  await auth.login(email.value, password.value)
  if (auth.user) router.push('/perfil')
}
</script>