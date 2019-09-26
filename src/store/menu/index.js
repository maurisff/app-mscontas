import sistema from './menuSistema'
import erro from './menuErro'
import acesso from './menuAcesso'

const state = {
  rotas: [
    sistema,
    erro,
    acesso
  ]
}

const mutations = {

}

const actions = {

}

const getters = {
  getMenu (state) {
    return state.rotas
  }
}

export default {
  namespaced: true,  
  state,
  mutations,
  actions,
  getters
}
