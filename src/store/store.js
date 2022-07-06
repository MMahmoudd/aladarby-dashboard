import Vue from 'vue'
import Vuex from 'vuex'

import login from './modules/login'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    barColor: '#ff9800',
    // barImage: 'https://demos.creative-tim.com/material-dashboard/assets/img/sidebar-1.jpg',
    drawer: null,
    stateMediaModal: false,
  },
  mutations: {
    SET_BAR_IMAGE (state, payload) {
      state.barImage = payload
    },
    SET_DRAWER (state, payload) {
      state.drawer = payload
    },
  },
  actions: {

  },
  modules: {
    login,
  },
})
