import Vue from 'vue'
import VueRouter from 'vue-router'
import Content from '../views/HomeContent.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Content',
    component: Content
  }
]

const router = new VueRouter({
  routes,
  // mode: 'history',
  // base: process.env.BASE_URL,
})

export default router
