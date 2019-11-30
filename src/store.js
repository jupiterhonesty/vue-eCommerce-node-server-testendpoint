import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

// https://stackoverflow.com/questions/42603909/accessing-vuex-state-when-defining-vue-router-routes

export default new Vuex.Store({
  state: {
    globalError: '',

    // switch to allow non sign in flow = false plus check router.js
    must_be_signed_in: true,

    app_user: {
      authenticated: false,
      access_token: null,
      longitude: null,
      latitude: null,
      user: null,
      temp_user: false,
    },

    web_user: {
      authenticated: false,
      access_token: null,
      user: null,
    },

    products: {
      listing: null,
      loaded: false,
    },

    shoppingcart: {
       cart: null,
       cart_count: 0,
    },

    api_base_url: 'https://happydelivery.io/webapi/V1/',


  },
  mutations: {
    setGlobalError (state, error) {
      state.globalError = error
    }
  },
  actions: {

  }
})
