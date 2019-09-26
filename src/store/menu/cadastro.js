/**
 * Created by yarik on 18.7.17.
 */
import lazyLoading from '@/util/lazyLoading'

export default [
  {
    path: '/cadastro/pessoas',
    meta: {
      codigo: 'CAD001',
      title: 'Pessoas',
      MenuTitle: 'Cadastro',
      menuClassIcon: null,
      menuPathIcon:null,
      classIcon: null,
      pathIcon:null,
      isMenu: true
    },
    component: lazyLoading('cadastro/Pessoa')
  }
]

