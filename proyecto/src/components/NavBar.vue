<template>
  <header class="nav">
    <div class="container bar">
      <router-link to="/" class="brand">🍽️ ReservaFácil</router-link>

      <nav class="links">
        <router-link to="/restaurantes">Restaurantes</router-link>
        <router-link to="/reservas">Mis reservas</router-link>
        <router-link to="/favoritos">Favoritos</router-link>
        <router-link to="/perfil">Perfil</router-link>
      </nav>

      <div class="auth" v-if="!isLogged">
        <router-link to="/login" class="ghost">Ingresar</router-link>
        <router-link to="/registro"><button>Crear cuenta</button></router-link>
      </div>

      <div class="auth" v-else>
        <span class="hello"> {{ user.name }}</span>
        <button class="ghost" @click="logout">Salir</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useAuth } from '../stores/auth'

const auth = useAuth()
const { user, isLogged } = storeToRefs(auth)
const logout = () => auth.logout()
</script>

<style scoped>
.nav{
  position: sticky; top: 0; z-index: 50;
  background: rgba(11,12,16,.6);
  border-bottom: 1px solid rgba(255,255,255,.06);
  backdrop-filter: blur(12px);
}
.bar{ display:flex; align-items:center; gap: 1rem; }
.brand{ font-weight: 800; letter-spacing:.3px; }
.links{ margin-left: 1rem; display:flex; gap:1rem; }
.links a{ color: var(--muted); }
.links a.router-link-active{ color: var(--text); }
.auth{ margin-left: auto; display:flex; gap:.6rem; align-items:center; }
.ghost{
  padding:.55rem .8rem; border-radius:999px;
  background: transparent; color: var(--text);
  border:1px solid rgba(255,255,255,.14);
}
.hello{ color: var(--muted); margin-right:.4rem; }
</style>