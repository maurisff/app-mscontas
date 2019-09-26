<template>
  <v-app>
    <v-navigation-drawer v-if="!isAcessoOuErro"
      v-model="drawer" app >
      <v-list dense>
        <v-list-item
          value="true"
          v-for="(item, i) in menu"
          :key="i"
          :to="{path:item.link}" >
          <v-list-item-action>
            <v-icon v-if="item.ico" v-html="item.ico"></v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.titulo"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list dense>
        <v-list-group
          v-model="menu.active"
          v-for="(menu, m) in menuLista"
          :key="'group.'+m"
          :prepend-icon="menu.ico"
          no-action >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{ menu.titulo }}</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item v-for="(item, y) in menu.itens" :key="'item.'+y" :to="{path:item.link}" >
            <v-list-item-content>
              <v-list-item-title>{{ item.titulo }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>{{ item.ico }}</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar v-if="!isAcessoOuErro" app dark >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>{{( userLogado && userLogado.negocio ? userLogado.negocio.nome : 'App 001' )}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn text slot="activator" to="/acesso/entrar" v-if="!isLogado">
            Entrar
          </v-btn>
          <v-menu v-if="isLogado" offset-y >            
            <template v-slot:activator="{ on: menu }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on: tooltip }">
                  <v-btn text  v-on="{ ...tooltip, ...menu }">
                    <v-avatar size="32px">
                        <img
                          v-if="usuario.photoURL"
                          :src="usuario.photoURL"
                          :alt="usuario.nome ? usuario.nome : usuario.email">
                        <v-icon v-else>account_circle</v-icon>
                      </v-avatar>
                        {{usuario.nome ? retornaPrimeiroNome(usuario.nome) : usuario.email }}
                  </v-btn>
                </template>
                <span>Usuário Logado</span>
              </v-tooltip>
            </template>
            <v-list>
              <v-list-item @click.stop="senha">
                <v-list-item-avatar>
                  <v-icon >account_box</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>Alterar Senha</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click.stop="logout">
                <v-list-item-avatar>
                  <v-icon >exit_to_app</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                <v-list-item-title>Sair</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>

        </v-toolbar-items>
    </v-app-bar>
    <v-content >
      <v-overlay :value="(isLoading || isProcessing)">
        <div class="divCenter" v-if="(isLoading || isProcessing)" >
          <v-progress-circular indeterminate :size="100" color="primary">{{getProcessingLabel}}</v-progress-circular>
        </div>
      </v-overlay>
      <router-view></router-view>
    </v-content>
    <v-footer :fixed="fixed" app v-if="!isAcessoOuErro">
      <span>&copy; 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
  // import app from '@/services/app'
  export default {
    name: 'LayoutApp',
    data () {
      return {
        clipped: true,
        drawer: false,
        fixed: false,
        menuProfile: true,
        miniVariant: false,
        right: true,
        rightDrawer: false,
        menuGrupo: [],
        menuAcesso: [{
            ico: 'home',
            titulo: 'Home',
            link: '/'
          }],
        entidadeSelected: null
      }
    },
    methods:{
      async logout (){      
        // await this.$store.dispatch('authentication/logout', null, { root: true });
        this.$router.push({ path: '/acesso/logout' }).catch(() => { });
      },
      senha (){      
        this.$router.push({ path: '/acesso/senha' }).catch(() => { console.info('push.catch9'); });
      },
      initAcessos: function(){
        //console.log('App Rotas: ', JSON.stringify( this.$router.options.routes));

      },
      retornaPrimeiroNome(displayName){
        return displayName.substring(0, (displayName.indexOf(" ")>-1 ? displayName.indexOf(" ") : displayName.length ));
      }
    },
    computed: {
      isLoading () {
        return this.$store.getters['app/isLoading']
      },
      isProcessing () {
        return this.$store.getters['app/isProcessing']
      },
      getProcessingLabel () {
        return this.$store.getters['app/getProcessingLabel']
      },
      isLogado:  function () {
        return (this.$store.getters['authentication/authUser'] !== null && this.$store.getters['authentication/authUser'] !== undefined);
      },
      isAutenticacao(){
        return this.$route.path.match('acesso')
      },
      isErro(){
        return this.$route.path.match('erro')
      },
      isAcessoOuErro(){
        return (this.$route.path.match('acesso') || this.$route.path.match('erro'))
      },
      userLogado: function(){
        return (this.isLogado ? this.$store.getters['authentication/authUser'] : null);
      },
      usuario: function(){
        return (this.isLogado ? this.$store.getters['authentication/authUser'].usuario : null);
      },
      rotas: function(){
        return this.$router.options.routes.filter(function(el){
            return ((el.meta && el.meta.isMenu || false) ? true : false);
          })
      },
      menu: function () {
        var vm = this
        return vm.rotas.filter(function(rota){
          return (rota.meta.MenuTitle ? false : true);
        }).filter(function(rota){
          return (rota.meta.pagePublic || 
                  (vm.usuario && vm.usuario.admin) || 
                  (rota.meta.requiresAccess && vm.usuario && vm.usuario.acessos && vm.usuario.acessos.indexOf(rota.path) > -1) );
        }).map(function(rota) {
          return {
            titulo: (rota.meta.title || 'Sem Nome'),
            link: rota.path,
            ico: (rota.meta.ico || undefined)
          }
        });
      },
      menuLista: function () {
        var vm = this
        vm.menuGrupo = []
        vm.rotas.filter(function(rota){
          return (rota.meta.MenuTitle ? true : false) ;
        }).filter(function(rota){
          return (rota.meta.pagePublic || 
                  (vm.usuario && vm.usuario.admin) || 
                  (rota.meta.requiresAccess && vm.usuario && vm.usuario.acessos && vm.usuario.acessos.indexOf(rota.path) > -1) );
        }).forEach(element => {
          if (vm.menuGrupo.map(function (e) {return e.titulo;}).indexOf(element.meta.MenuTitle) > -1){
            for (let i = 0; i < vm.menuGrupo.length; i++) {
              if ( vm.menuGrupo[i].titulo === element.meta.MenuTitle){
                vm.menuGrupo[i].itens.push({
                  titulo: (element.meta.title || 'Sem Nome'),
                  link: element.path,
                  ico: (element.meta.ico || undefined)
                })
              }
            }
          }else{
            vm.menuGrupo.push({
              titulo: (element.meta.MenuTitle || 'Sem Nome'),
              ico: (element.meta.MenuIco || undefined),
              itens: [{
                  titulo: (element.meta.title || 'Sem Nome'),
                  link: element.path,
                  ico: (element.meta.ico || undefined)
                }]
            })
          }
        });
        return vm.menuGrupo
      }
    },
    mounted(){
      // console.log('=========================> Data-Hota: ', app.util.moment().toDate())
    },
    created(){
      this.initAcessos();
    },
    watch:{
      $route () {
          /*
          let parent = _findMatchingParentMenuItem.call(this, route.name) || {}
          this.menuItems.forEach((item) => {
            this.expand({
              menuItem: item,
              expand: parent.name === item.name
            })
          })
          */
      }
    }
  }
</script>

<style scoped>
.progressEntidade {
  top: 40%;
  left: 40%;
  position: absolute;
  text-align: center;
  margin: 2rem;
}

.divCenter{
    top: 50%;
    left: 50%;
    position: absolute;
    text-align: center;
}
.progress-circular{
  margin: 1rem
}
</style>
