/**
 * Created by yarik on 18.7.17.
 */
import lazyLoading from '@/util/lazyLoading'

export default [
  {
    path: '/lancamento/contas',
    meta: {
      codigo: 'LAN001',
      title: 'Contas Pag/Rec',
      MenuTitle: 'Lançamentos',
      menuClassIcon: null,
      menuPathIcon:null,
      classIcon: null,
      pathIcon:null,
      isMenu: true
    },
    component: lazyLoading('lancamento/ContasPagarReceber')
  }
]

