import { defineStore } from "pinia";
import usersApi from "@/api/users";

export const useUsersStore = defineStore("users", {
    state: () => ({
        user: null,
    }),

    actions: {
        async loadUser(id = 1) {
            this.user = await usersApi.getUserById(id);
            if (!Array.isArray(this.user.favorites)) {
                this.user.favorites = [];
            }
        },

        async toggleFav(restoId) {
            if (!this.user) return;

            const favs = this.user.favorites;
            const newFavs = favs.includes(restoId)
                ? favs.filter(id => id !== restoId)
                : [...favs, restoId];
            this.user.favorites = newFavs;
            await usersApi.updateUser(this.user.id, {
                favorites: newFavs
            });
        },
    },
});
