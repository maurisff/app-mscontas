import Vue from 'vue'
import Vuex from 'vuex'
import app from '@/store/app'
import authentication from '@/store/authentication'
import common from '@/store/common'
import menu from '@/store/menu'
//www - gerar importação automatica dos modulos
import movimentoTerminal from '@/store/modules/movimentoTerminal.module'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app: app,
    authentication: authentication,
    common: common,
    menu: menu,
    movimentoTerminal: movimentoTerminal
  },
/*
  state: {
    world: 'world'
  },

  actions: {},

  mutations: {},

  getters: {},
  */
  strict: process.env.NODE_ENV !== 'production'
})
