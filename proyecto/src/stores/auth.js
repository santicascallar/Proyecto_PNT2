import { defineStore } from 'pinia'

const USERS_KEY = 'rf_users'  // array de usuarios registrados
const LS_KEY    = 'rf_user'   // usuario actualmente logueado

function loadUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') } catch { return [] }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export const useAuth = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem(LS_KEY) || 'null'),
    loading: false,
    error: null,
  }),
  getters: {
    isLogged: (s) => !!s.user,
  },
  actions: {
    async register({ name, email, password }) {
      try {
        this.loading = true
        this.error = null
        await new Promise(r => setTimeout(r, 400))

        const users = loadUsers()
        const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase())
        if (exists) {
          this.error = 'Ese email ya está registrado'
          return
        }

        const newUser = { id: Date.now(), name, email, password }
        users.push(newUser)
        saveUsers(users)

        // Autologin tras registrar
        this.user = { id: newUser.id, name: newUser.name, email: newUser.email }
        localStorage.setItem(LS_KEY, JSON.stringify(this.user))
      } catch (e) {
        this.error = 'No pudimos registrar tu cuenta'
      } finally {
        this.loading = false
      }
    },

    async login(email, password) {
      try {
        this.loading = true
        this.error = null
        await new Promise(r => setTimeout(r, 300))

        const users = loadUsers()
        const found = users.find(u =>
          u.email.toLowerCase() === String(email).toLowerCase() &&
          String(u.password) === String(password)
        )

        if (!found) {
          this.error = 'Credenciales inválidas'
          this.user = null
          localStorage.removeItem(LS_KEY)
          return
        }

        this.user = { id: found.id, name: found.name, email: found.email }
        localStorage.setItem(LS_KEY, JSON.stringify(this.user))
      } catch (e) {
        this.error = 'No pudimos iniciar sesión'
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      localStorage.removeItem(LS_KEY)
    }
  }
})