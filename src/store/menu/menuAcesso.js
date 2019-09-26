import lazyLoading from '@/util/lazyLoading'

export default {
  nome: 'Acessos',
  isMenu: false,
  rotas: [
    {
      path: '/acesso/entrar',
      meta: { 
        codigo: 'AUT002',
        title: 'Login',
        pagePublic: true
      },
      component: lazyLoading('acesso/Entrar')
    },
    {
      path: '/acesso/registre-se',
      meta: { 
        codigo: 'AUT002',
        title: 'Registre-se',
        pagePublic: true
      },
      component: lazyLoading('acesso/Registre-se')
    },
    {
      path: '/acesso/logout',
      meta: { 
        codigo: 'AUT007', 
        title: 'Logout'
      },
      component: lazyLoading('acesso/Logout')
    },
    {
      path: '/acesso/senha',
      meta: { 
        codigo: 'AUT007', 
        title: 'Senha'
      },
      component: lazyLoading('acesso/Senha')
    },
    {
      path: '/acesso/senha/:id',
      meta: { 
        codigo: 'AUT008',
        title: 'Nova Senha'
     },
      component: lazyLoading('acesso/AlteraSenha')
    }

  ]
}
