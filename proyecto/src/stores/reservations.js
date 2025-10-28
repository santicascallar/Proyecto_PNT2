import { defineStore } from 'pinia'

export const useReservations = defineStore('reservations', {
  state: () => ({ list: [] }),
  actions: {
    add(payload, restaurant){
      this.list.push({
        id: Date.now(),
        restaurantId: payload.restaurantId,
        restaurantName: restaurant?.name || 'Restaurante',
        people: payload.people,
        datetime: payload.datetime
      })
    },
    cancel(id){ this.list = this.list.filter(r => r.id !== id) }
  }
})