import { defineStore } from 'pinia'
import api from "../services/api.js"

const LS_KEY = 'rf_user'   // usuario actualmente logueado

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
        this.loading = true;
        this.error = null;

        //backend
        const res = await api.register({
          name,
          email,
          password,
        });

        this.user = res.user;
        this.token = res.token;

        localStorage.setItem(LS_KEY, JSON.stringify(res.user));
        localStorage.setItem("rf_token", res.token);

      } catch (err) {
        this.error = err.message || "Error al registrar";
        this.user = null;
      } finally {
        this.loading = false;
      }
    },

    async login(email, password) {
     try {
        this.loading = true;
        this.error = null;

        const res = await api.login({ email, password });

        this.user = res.user;
        this.token = res.token;

        localStorage.setItem(LS_KEY, JSON.stringify(res.user));
        localStorage.setItem("rf_token", res.token);

      } catch (err) {
        this.error = err.message || "Credenciales inválidas";
        this.user = null;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem(LS_KEY);
      localStorage.removeItem("rf_token");
    }
  }
})