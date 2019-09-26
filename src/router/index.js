import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/'

Vue.use(Router)

var INSTANCE_ROUTER = new Router({
  //mode: 'history', //com isso no FirebaseHosting se perde na hora de carregar a pagina pela URL
  routes: [
    {
      path: '*',
      redirect: '/erro/404'
    },
    ...generateRoutesFromMenu(store.getters['menu/getMenu'])
  ]
})

INSTANCE_ROUTER.beforeEach(async (to, from, next) => {

  console.log('Algo esta acontecendo... from: '+from.fullPath+' => to: '+to.fullPath);
  if (!to.fullPath.includes('/acesso/entrar') &&  store.getters['authentication/authUser'] && store.getters.isChangePasswordUser){
    // alterar a senha do susuario
    if (to.fullPath.includes('/acesso/senha')){
      next();
    } else {
      store.dispatch('app/setMessage', { type: 'info', message: 'Por gentileza, informe uma nova senha de acesso!' }, { root: true })
      next({
        path: '/acesso/senha',
        query: { redirect: to.fullPath }
      });
    }
  } else if (!to.matched.some(record => record.meta.pagePublic)) {
    if (!store.getters['authentication/authUser']) {
      next({
        path: '/acesso/entrar',
        query: { redirect: to.fullPath }
      });
    } else if(!store.getters['authentication/authUser'].usuario){
      store.dispatch('app/setErro', 'Você ainda não possui um perfil de usuario para acesso ao sistema.', { root: true });
      next({
        path: '/erro/ops'
      });
    } else if(to.matched.some(record => record.meta.requiresAdmin) && !store.getters['authentication/authUser'].usuario.admin ){
      store.dispatch('app/setErro', 'Acesso restrito a administração do Sistema!', { root: true });
      next({
        path: '/erro/ops'
      });
    } else if(store.getters['authentication/authUser'].usuario.admin ){
      next()
    }else if(to.meta.requiresAccess && 
      (!store.getters['authentication/authUser'].usuario.acessos || store.getters['authentication/authUser'].usuario.acessos.indexOf(to.fullPath) === -1 ) ){
      store.dispatch('app/setErro', 'Usuario não possui acesso. Contate o Administrador do Sistema.', { root: true });
      next({
        path: '/erro/ops'
      });
    }else{
      next();
    }
  } else {
    next();
  }
})

function generateRoutesFromMenu (menu = [], rota = '', routes = []) {
  for (let i = 0, l = menu.length; i < l; i++) {
    let item = menu[i]
    if (item.path !== undefined && item.path !== null) {
      item.path = rota+item.path
      routes.push(item)
    }
    if (item.rotas) {
      generateRoutesFromMenu(item.rotas, (item.rota || ''), routes)
    }
  }
  return routes
}

export default INSTANCE_ROUTER
