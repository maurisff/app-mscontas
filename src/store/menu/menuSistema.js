
import lazyLoading from '@/util/lazyLoading'
import administracao from '@/store/menu/administracao'
import cadastro from '@/store/menu/cadastro'
import lancamento from '@/store/menu/lancamento'
import movimento from '@/store/menu/movimento'
import relatorio from '@/store/menu/relatorio'
export default {
  nome: 'Sistema',
  isMenu: true,
  rotas: [{
      path: '/',
      meta: {
        codigo: 'PAG000',
        title: 'Home',
        isMenu: true,
        MenuTitle: ''
      },
      component: lazyLoading('layout/Home')
    },
    ...administracao,
    ...cadastro,
    ...lancamento,
    ...movimento,
    ...relatorio
  ]
}
