import lazyLoading from '@/util/lazyLoading'

export default {
  nome: 'Erros',
  isMenu :false,
  rotas: [
    {
      path: '/erro/404',
      meta: {
        pagePublic: true
      },
      component: lazyLoading('erro/NotFound')
    },
    {
      path: '/erro/ops',
      meta: { 
        pagePublic: true
      },
      component: lazyLoading('erro/OtherErro')
    }
  ]
}
