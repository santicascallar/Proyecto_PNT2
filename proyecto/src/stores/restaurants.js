import { defineStore } from "pinia";
import {
  getRestaurants, getRestaurantById,
  createRestaurant, updateRestaurant, deleteRestaurant,
} from "../services/restaurants.api.js";

export const useRestaurantsStore = defineStore("restaurants", {
  state: () => ({
    list: [],
    selected: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAll() {
      this.loading = true; this.error = null;
      try { this.list = await getRestaurants(); }
      catch (e) { this.error = e.message; }
      finally { this.loading = false; }
    },
    async fetchOne(id) {
      this.loading = true; this.error = null;
      try { this.selected = await getRestaurantById(id); }
      catch (e) { this.error = e.message; }
      finally { this.loading = false; }
    },
    async create(payload) {
      this.loading = true; this.error = null;
      try {
        const created = await createRestaurant(payload);
        this.list.unshift(created);
        return created;
      } catch (e) {
        this.error = e.message; throw e;
      } finally { this.loading = false; }
    },
    async update(id, payload) {
      this.loading = true; this.error = null;
      try {
        const updated = await updateRestaurant(id, payload);
        const i = this.list.findIndex(r => r._id === updated._id || r.id == id);
        if (i !== -1) this.list.splice(i, 1, updated);
        if (this.selected?._id === updated._id) this.selected = updated;
        return updated;
      } catch (e) {
        this.error = e.message; throw e;
      } finally { this.loading = false; }
    },
    async remove(id) {
      this.loading = true; this.error = null;
      try {
        await deleteRestaurant(id);
        this.list = this.list.filter(r => r._id !== id && r.id != id);
        if (this.selected?._id === id) this.selected = null;
      } catch (e) {
        this.error = e.message; throw e;
      } finally { this.loading = false; }
    },
  },
});