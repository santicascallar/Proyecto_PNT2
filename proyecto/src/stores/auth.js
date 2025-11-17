import { defineStore } from "pinia";
import { loginRequest, registerRequest } from "../services/api.js";

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
        const data = await registerRequest(payload);

        this.user = data.user;
        this.token = data.token;

        localStorage.setItem(LS_USER, JSON.stringify(data.user));
        localStorage.setItem(LS_TOKEN, data.token);

      } catch (e) {
        this.error = e.message || "Error al registrar";
      } finally {
        this.loading = false;
      }
    },

    async login(email, password) {
      this.loading = true;
      this.error = null;

      try {
        const data = await loginRequest({ email, password });

        this.user = data.user;
        this.token = data.token;

        localStorage.setItem(LS_USER, JSON.stringify(data.user));
        localStorage.setItem(LS_TOKEN, data.token);

      } catch (e) {
        this.error = e.message || "Las credenciales son inválidas";
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

    async updateProfile(data) {
      try {
        this.loading = true;
        this.error = null;

        const res = await updateUser(this.user._id, data, this.token);

        // Actualiza store
        this.user = res.user;
        localStorage.setItem("rf_user", JSON.stringify(this.user));

        return true;
      } catch (e) {
        this.error = e.message;
        return false;
      } finally {
        this.loading = false;
      }
    }
  }
});