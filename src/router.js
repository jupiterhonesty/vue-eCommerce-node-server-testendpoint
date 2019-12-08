import Vue from 'vue'
import Router from 'vue-router'

import store from './store.js'

import Home from './views/Home.vue'
import About from './views/About.vue'
import Account from './views/Account.vue'
import Authenticate from './views/Authenticate.vue'
import Checkout from './views/Checkout.vue'
import Shop from './views/Shop.vue'
import Order from './views/Order.vue'
import Orderhistory from './views/Orderhistory.vue'

Vue.use(Router)

// https://stackoverflow.com/questions/42603909/accessing-vuex-state-when-defining-vue-router-routeshttps://stackoverflow.com/questions/42603909/accessing-vuex-state-when-defining-vue-router-routes

// Lazy loading start page
const AsyncAppstart = () => import(`./views/Appstart.vue`);

const router = new Router({

  mode: 'history',

  base: process.env.BASE_URL,

  routes: [
    {
      path: '/',
      name: 'appstart',
      component: AsyncAppstart
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: {requiresLogin: false},
    },
    {
      path: '/about',
      name: 'about',
      component: About,
      meta: {requiresLogin: true},
    },
    {
      path: '/authenticate',
      name: 'authenticate',
      component: Authenticate
    },
    {
      path: '/account',
      name: 'account',
      component: Account,
      // disable for non signin mode
      meta: {requiresLogin: true},
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: Checkout,
      // disable for non signin mode
      meta: {requiresLogin: true},
    },
    {
      path: '/shop',
      name: 'shop',
      component: Shop,
      meta: {requiresLogin: true},
    },
    {
      path: '/order',
      name: 'order',
      component: Order,
      // disable for non signin mode
      meta: {requiresLogin: true},
    },
    {
      path: '/orderhistory',
      name: 'orderhistory',
      component: Orderhistory,
      // disable for non signin mode
      meta: {requiresLogin: true},
    },
  ]

})

router.beforeEach((to, from, next) => {

  // You can use store variable here to access globalError or commit mutation

  if (to.matched.some(record => record.meta.requiresLogin) && ((!store.state.app_user.authenticated) && (!store.state.web_user.authenticated)) ) {
    next("/authenticate")
  } else {
    next()
  }
})

export default router;
