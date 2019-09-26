<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height justify-center>
        <v-layout align-center justify-center v-if="!isLoading && !user">
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-dialog v-model="isLoginAction">
                <v-progress-circular class="progressLogin" indeterminate :size="sizeProgress" color="primary">{{txtLogando}}</v-progress-circular>
              </v-dialog>
              <v-toolbar dark color="primary">
                <v-toolbar-title >Login</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form @submit.prevent="authLogin">
                  <v-text-field prepend-icon="person" label="Login" type="text" v-model="login"
                      :error-messages="errors.collect('login')" v-validate="'required'" data-vv-name="login" ></v-text-field>
                  <v-text-field prepend-icon="lock" label="Senha"  type="password" v-model="senha"
                      :error-messages="errors.collect('senha')" v-validate="'required|min:3'" data-vv-name="senha" ></v-text-field>
                  <v-select v-if="(negociosUsuario.length > 1)" prepend-icon="business" label="Negócio" v-model="negocio"
                      :items="negociosUsuario" item-text="nome" item-value="codigo" single-line
                      :error-messages="errors.collect('negocio')" v-validate="'required'" data-vv-name="negocio"
                      return-object ></v-select>
                  <v-checkbox v-model="lembrar" :label="`Manter Conectado`"></v-checkbox>
                  <div class="center" >
                    <v-btn dark class="ma-2" color="primary" type="submit">
                      <v-icon dark left>check_circle</v-icon>Entrar
                    </v-btn>
                    <v-btn dark class="ma-2" color="primary" left @click.stop="registro">
                      <v-icon dark left>how_to_reg</v-icon>Registre-se
                    </v-btn>
                  </div>                  
                  <div v-if="isDevelopment && 1 === 2">
                    <pre>
                      login: {{ login }}
                      negocio: {{ negocio }}
                      negociosUsuario: {{ negociosUsuario }}
                      usuarios: {{ usuarios }}
                    </pre>
                  </div>
                </v-form>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import app from '@/services/app'

  export default {
    name: 'Acesso.Entrar',
    data: () => ({
      usuarios: [],
      login: null,
      senha: null,
      negocio: null,
      lembrar: false,
      redirect: null,
      dialog: false,
      sizeProgress: 85,
      txtLogando: 'Entrando...',
      dictionary : {
        custom: {
          login: {
            required: () =>  'Informe seu login de acesso!'
          },
          senha: {
            required: () =>  'Informe sua senha de acesso!',
            min: () => 'O campo de senha deve ter pelo menos 3 caracteres!'
          },
          negocio: {
            required: () =>  'Selecione um negócio para acesso!'
          }
        }
      }
    }),
    props: {
      source: String
    },
    watch: {
      user (value) {
        this.postLogin(value);
      },
      negociosUsuario (values){
        if (this.negocio){
          if (values.indexOf(this.negocio) < 0){            
            this.negocio = null;
          }
        } else {          
          if (values.length === 1 ){            
            this.negocio = values[0];
          }
        }       
      }
    },
    computed:{
      isLoading: function () {
        return (this.$store.getters['app/isLoading'])
      },
      user () {
        return this.$store.getters['authentication/authUser']
      },
      isLoginAction: function () {
        return (this.$store.getters['authentication/isLoggingIn'])
      },
      negociosUsuario (){
        var vm = this;
        return ( vm.usuarios && vm.usuarios.find((f) => f.login === vm.login) ? vm.usuarios.find((f) => f.login === vm.login).acessos : [])
      },
      isDevelopment (){
        return (process.env.NODE_ENV === 'development')
      }      
    },
    created() {
      if (this.$route.query.redirect){
        this.redirect = this.$route.query.redirect;
      }if (this.$route.query.alterar){
        this.alterarEntidade = true;
      }
      this.postLogin(this.user);
    },
    mounted() {
      this.$validator.localize('en', this.dictionary);
      this.fetchData();
    },
    methods:{
      registro(){
        this.$router.push({ path: '/acesso/registre-se' }).catch(() => { console.info('push.catch6'); });
      },
      postLogin: function(userLogado){
        if (userLogado) {
          var vm = this;
          if (vm.$store.getters['authentication/authUser'].usuario){
            //if (!vm.$store.getters['authentication/authUser'].usuario.entidade || vm.alterarEntidade){
            if (vm.redirect){
              vm.$router.push({ path: vm.redirect }).catch(() => { });
            }else{
              vm.$router.push({ path: '/' }).catch(() => { });
            }
          } else {
            if (vm.redirect){
              vm.$router.push({ path: '/acesso/usuario', query: { redirect: vm.redirect } }).catch(() => { });
            }else{
              vm.$router.push({ path: '/acesso/usuario' }).catch(() => {});
            }
          }
        }
      },
      async authLogin(){
        var vm = this
        this.$validator.validateAll().then(async success =>{
          if (success){
              await vm.$store.dispatch('authentication/loginAction', {
                login: vm.login, 
                senha: vm.senha, 
                negocio: vm.negocio, 
                lembrar: vm.lembrar
              }, { root: true })
          }
        })
      },
      async fetchData () {
        var vm = this;        
        vm.$store.dispatch('app/setLoading', true, { root: true })
        await app.get('api/authentication/user/list').then(async (response) => {
          vm.usuarios = [];
          if (response.status === 200 && response.data && response.data.success){
            vm.usuarios = response.data.data || [];
          }
        }).catch(error => {
          console.error('Error get users: ', error)
        });        
        vm.$store.dispatch('app/setLoading', false, { root: true })
      }
    }
  }
</script>

<style >

.progressLogin {
  top: 40%;
  left: 40%;
  position: absolute;
  text-align: center;
  margin: 2rem;
}

</style>
