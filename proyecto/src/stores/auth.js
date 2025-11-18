import { defineStore } from "pinia";
import { register as registerRequest, login as loginRequest } from "../services/auth.api.js";

const LS_USER = "rf_user";
const LS_TOKEN = "rf_token";

export const useAuth = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem(LS_USER) || "null"),
    token: localStorage.getItem(LS_TOKEN) || null,
    loading: false,
    error: null,
  }),

  getters: {
    isLogged: (s) => !!s.token,
    isAdmin: (s) => s.user?.role === "admin",
    isClient: (s) => s.user?.role === "client",
  },

  actions: {
    async register(payload) {
      this.loading = true;
      this.error = null;
      try {
        const res = await registerRequest(payload);
        this.user = res.user || res;
        this.token = res.token || this.token;
        localStorage.setItem(LS_USER, JSON.stringify(this.user));
        if (res.token) localStorage.setItem(LS_TOKEN, res.token);
        return res;
      } catch (e) {
        this.error = e.message || "Error al registrar";
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const res = await loginRequest({ email, password });
        this.user = res.user || res;
        this.token = res.token || this.token;
        localStorage.setItem(LS_USER, JSON.stringify(this.user));
        if (res.token) localStorage.setItem(LS_TOKEN, res.token);
        return res;
      } catch (e) {
        this.error = e.message || "Las credenciales son inválidas";
        throw e;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem(LS_USER);
      localStorage.removeItem(LS_TOKEN);
    },
  },
});
