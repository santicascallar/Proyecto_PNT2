import { defineStore } from "pinia";
import {
  getReservations,
  getReservationById,
  getReservationByUser,
  createReservation,
  updateReservation,
  deleteReservation,
} from "../services/reservations.api.js";

export const useReservations = defineStore("reservations", {
  state: () => ({
    list: [],
    selected: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchAll(params = {}, token) {
      this.loading = true;
      this.error = null;
      try {
        this.list = await getReservations(params, token);
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchOne(id, token) {
      this.loading = true;
      this.error = null;
      try {
        this.selected = await getReservationById(id, token);
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchByUser(userId, token) {
      this.loading = true;
      this.error = null;
      try {
        this.list = await getReservationByUser(userId, token);
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },

    async create(payload, token) {
      this.loading = true;
      this.error = null;
      try {
        const created = await createReservation(payload, token);
        // push to local list for immediate UI update
        this.list.unshift(created);
        return created;
      } catch (e) {
        this.error = e.message;
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async update(id, payload, token) {
      this.loading = true;
      this.error = null;
      try {
        const updated = await updateReservation(id, payload, token);
        const i = this.list.findIndex((r) => r._id === updated._id || r.id == id);
        if (i !== -1) this.list.splice(i, 1, updated);
        if (this.selected?._id === updated._id) this.selected = updated;
        return updated;
      } catch (e) {
        this.error = e.message;
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async remove(id, token) {
      this.loading = true;
      this.error = null;
      try {
        await deleteReservation(id, token);
        this.list = this.list.filter((r) => r._id !== id && r.id != id);
        if (this.selected?._id === id) this.selected = null;
      } catch (e) {
        this.error = e.message;
        throw e;
      } finally {
        this.loading = false;
      }
    },
  },
});
