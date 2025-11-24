<template>
  <header class="nav">
    <div class="container bar">
      <router-link to="/" class="brand">🍽️ ReservaFácil</router-link>

      <nav class="links">
        <router-link to="/restaurantes">Restaurantes</router-link>

        <router-link v-if="isLogged" to="/reservas">Mis reservas</router-link>
        <router-link v-if="isLogged" to="/favoritos">Favoritos</router-link>
        <router-link v-if="isLogged" to="/perfil">Mi perfil</router-link>

        <router-link v-if="auth.isAdmin" to="/reports">Reportes</router-link>
        <router-link v-if="auth.isAdmin" to="/admin">Panel Admin</router-link>
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
import { storeToRefs } from "pinia";
import { useAuth } from "../stores/auth";

const auth = useAuth();
const { user, isLogged } = storeToRefs(auth);
const logout = () => auth.logout();
</script>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(11, 12, 16, 0.6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(12px);
}

.bar {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand {
  font-weight: 800;
  letter-spacing: 0.3px;
}

.links {
  margin-left: 1rem;
  display: flex;
  gap: 1rem;
}

.links a {
  color: var(--muted);
}

.links a.router-link-active {
  color: var(--text);
}

.auth {
  margin-left: auto;
  display: flex;
  gap: 0.6rem;
  align-items: center;
}

.ghost {
  padding: 0.55rem 0.8rem;
  border-radius: 999px;
  background: transparent;
  color: var(--text);
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.hello {
  color: var(--muted);
  margin-right: 0.4rem;
}
</style>
