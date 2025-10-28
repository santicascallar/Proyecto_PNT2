import { defineStore } from 'pinia'
import { db } from '../mock/db'   

export const useRestaurants = defineStore('restaurants', {
  state: () => ({ list: [], loading:false, error:null }),
  actions: {
    async fetch() {
      try {
        this.loading = true
        await new Promise(r => setTimeout(r, 300)) 
        this.list = db.restaurants
      } catch (e) {
        this.error = 'No pudimos cargar los restaurantes'
      } finally {
        this.loading = false
      }
    },
    byId(id){ return this.list.find(r => String(r.id) === String(id)) }
  }
})