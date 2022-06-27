import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: ()=>import("../views/Content.vue")
  },
  {
    path: '/Register',
    name: 'Register',
    component: ()=>import("../views/Register.vue")
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach()
export default router