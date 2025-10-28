import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('../views/HomeView.vue')
const Restaurants = () => import('../views/RestaurantsView.vue')
const Detail = () => import('../views/RestaurantDetailView.vue')
const Reservations = () => import('../views/ReservationsView.vue')
const Favorites = () => import('../views/FavoritesView.vue')
const Profile = () => import('../views/ProfileView.vue')
const Preferences = () => import('../views/PreferencesView.vue')
const Login = () => import('../views/AuthLoginView.vue')
const Register = () => import('../views/AuthRegisterView.vue')
const Admin = () => import('../views/admin/AdminDashboardView.vue')

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/restaurantes', name: 'restaurants', component: Restaurants },
  { path: '/restaurantes/:id', name: 'restaurant-detail', component: Detail, props: true },
  { path: '/reservas', name: 'reservations', component: Reservations },
  { path: '/favoritos', name: 'favorites', component: Favorites },
  { path: '/perfil', name: 'profile', component: Profile },
  { path: '/preferencias', name: 'preferences', component: Preferences },
  { path: '/login', name: 'login', component: Login },
  { path: '/registro', name: 'register', component: Register },
  { path: '/admin', name: 'admin', component: Admin },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})

export default router