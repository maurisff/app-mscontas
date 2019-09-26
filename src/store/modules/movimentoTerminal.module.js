export default {
  namespaced: true,
  state: {
		movimentoTerminal: null,
  },
  mutations: {
    async setMovimentoTerminal (state, payload) {
      state.movimentoTerminal = payload
    },
  },
  actions: {
    async setMovimentoTeminal ({commit}, payload) {
			await commit('setMovimentoTerminal', payload)
    },
    async clearMovimentoTerminal ({commit}) {
      await commit('setMovimentoTerminal', null)
    }
  },
  getters: {
    getMovimentoTerminal (state) {
      return state.movimentoTerminal
    }
  }
}
