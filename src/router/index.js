import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'BabylonScene',
    component: () => import('../views/BabylonScene.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
