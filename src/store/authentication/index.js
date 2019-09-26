import app from '@/services/app'

export default {
  namespaced: true, 
  state: {
    loggingIn:false,
    user: null,
    isChangePasswordUser: null
  },
  mutations: {
    setLoggingIn (state, payload) {
      state.loggingIn = payload
    },
    setUsuario (state, payload) {
      state.user = payload
    },
    setIsChangePassword (state, payload) {
      state.isChangePasswordUser = payload
    }
  },
  actions: {    
    async loginAction ({commit, dispatch}, payload) {      
      commit('setLoggingIn', true)
      await app.login(payload.login, payload.senha, payload.negocio, payload.lembrar).then(async user => {
        await dispatch('authentication/setIsChangePassword', ((user && user.usuario && user.usuario.alteraSenha) ? true : false), { root: true });
        await dispatch('authentication/autoLogin', user, { root: true })
        commit('setLoggingIn', false)
      }).catch(error => {
        commit('setLoggingIn', false)
        if (error && error.errorType && error.message ){
          dispatch('app/setMessage', {
            type: error.errorType,
            message: error.message
          }, { root: true })
        } else {
          dispatch('app/setMessage', {
            type: 'error',
            message: error
          }, { root: true })
        }
      })
    },    
    async autoLogin ({dispatch}, payload) {
      await dispatch('authentication/setUsuario', payload, { root: true })
    },
    async logout ({dispatch}) {
      await app.logout()
      await dispatch('authentication/setUsuario', null, { root: true })
    }, 
    async setIsChangePassword ({commit}, payload) {
      await commit('setIsChangePassword', payload)
    },
    async setUsuario ({commit, dispatch}, payload) {    
      try {
        await commit('setUsuario', payload)
        // www commit('setLoading', false)
      } catch (error) {
        // www commit('setLoading', false)
        dispatch('app/setMessage', {
          type: 'error',
          message: 'Erro ao carregar usuario autenticado. \nErro: ' + error
        }, { root: true })
      }
    },
  },
  getters: {
    isLoggingIn (state) {
      return state.loggingIn
    },
    authUser (state) {
      return state.user
    },
    isChangePasswordUser (state) {
      return state.isChangePasswordUser
    }
  }
}
