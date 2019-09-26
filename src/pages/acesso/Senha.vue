<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height justify-center v-if="!isLoading">
        <v-dialog v-model="isSalvando">
          <v-progress-circular class="progressProcessando" indeterminate :size="sizeProgress" color="primary">{{txtLogando}}</v-progress-circular>
        </v-dialog>
        <v-layout align-center justify-center >
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title >Senha</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form @submit.prevent="alterar">
                  <v-text-field v-if="!isChangePassword" prepend-icon="lock" label="Senha Atual"  type="password" v-model="senhaAtual"
                      :error-messages="errors.collect('senhaAtual')" v-validate="'required|min:3'" data-vv-name="senhaAtual" ></v-text-field>
                  <v-text-field prepend-icon="lock" label="Nova Senha"  type="password" v-model="novaSenha"
                      :error-messages="errors.collect('novaSenha')" v-validate="'required|min:3'" data-vv-name="novaSenha" ></v-text-field>
                  <v-text-field prepend-icon="lock" label="Confirme a Nova Senha"  type="password" v-model="confirmaNovaSenha"
                      :error-messages="errors.collect('confirmaNovaSenha')" v-validate="'required|min:3'" data-vv-name="confirmaNovaSenha" ></v-text-field>
                  <div class="text-xs-center" >
                    <v-btn dark class="ma-2" color="primary" v-if="!isChangePassword" @click.stop="voltar">
                      <v-icon dark left>arrow_back</v-icon>Voltar
                    </v-btn>
                    <v-btn dark class="ma-2" color="primary" type="submit">
                      <v-icon dark left>check_circle</v-icon>Alterar
                    </v-btn>
                    <!-- <v-btn dark color="primary" to="/acesso/cadastro">Criar Acesso</v-btn> -->
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
    name: 'Acesso.Senha',
    data: () => ({
      senhaAtual: null,
      novaSenha: null,
      confirmaNovaSenha: null,
      redirect: null,
      isSalvando: false,
      sizeProgress: 85,
      txtLogando: 'Alterando...',
      dictionary : {
        custom: {
          confirmaNovaSenha: {
            required: () =>  'Confirme a Nova Senha!',
            min: () => 'O campo de confirmação da nova semanha deve ter pelo menos 3 caracteres!'
          },
          novaSenha: {
            required: () =>  'Informe a Nova Senha!',
            min: () => 'O campo de Nova Senha deve ter pelo menos 3 caracteres!'
          },
          senhaAtual: {
            required: () =>  'Informe a Senha Atual',
            min: () => 'O campo de Senha Atual deve ter pelo menos 3 caracteres!'
          }
        }
      }
    }),
    props: {
      source: String
    },
    watch: {

    },
    computed:{
      isLoading: function () {
        return (this.$store.getters['app/isLoading'])
      },
      userLogado(){
        return ((this.$store.getters['authentication/authUser'] && this.$store.getters['authentication/authUser'].usuario) ? this.$store.getters['authentication/authUser'].usuario : null)
      },
      isChangePassword(){
        return (this.$store.getters.isChangePasswordUser ? true : false)
      },
      isLoginAction: function () {
        return (this.$store.getters['authentication/isLoggingIn'])
      }
      
    },
    created() {
      if (this.$route.query.redirect){
        this.redirect = this.$route.query.redirect;
      }
    },
    mounted() {
      this.$validator.localize('en', this.dictionary);
    },
    methods:{
      async voltar (){
        this.$router.push({ path: '/' }).catch(() => { });
      },
      fechar: function(){
        var vm = this
        if (vm.redirect){
          vm.$router.push({ path: vm.redirect }).catch(() => {});
        }else{
          vm.$router.push({ path: '/' }).catch(() => {
            
          });
        }
      },
      async validaSenhaServidor(senha, usuarioId){
        return await app.post('api/usuario/validasenha', {usuarioId: usuarioId, senha: senha}).then(async (response) => {
          if (response.status === 200 && response.data ){
            return true;
          } else {
            return false;
          }
        }).catch(() => {
            return false;
        });
      },
      async alterar(){
        var vm = this
        try {
          this.$validator.validateAll().then(async success =>{
            vm.isSalvando = true
            if (success){
              if (!vm.userLogado){
                // validar senha no servidor
                await vm.$store.dispatch('app/setMessage', { type: 'error', message: 'Ops!. Houve algo de errado, e não foi posivel identificar o usuário logado. Atualize a pagina por favor.' }, { root: true });
              } else if (!vm.isChangePassword && !await vm.validaSenhaServidor(vm.senhaAtual, vm.userLogado._id)){
                // validar senha no servidor
                await vm.$store.dispatch('app/setMessage', { type: 'info', message: 'A senha atual não confere!' }, { root: true });
              } else if (vm.novaSenha !== vm.confirmaNovaSenha) {                
                await vm.$store.dispatch('app/setMessage', { type: 'info', message: 'O senha de confirmação não confere com a nova senha. Verififique!' }, { root: true });
              } else {
                await app.post('api/usuario/atualizasenha', {usuarioId: vm.userLogado._id, senha: vm.novaSenha}).then(async (response) => {
                  if (response.status === 200 && response.data && response.data.success ){                    
                    await vm.$store.dispatch('app/setMessage', { type: 'success', message: 'Senha Atualizada com sucesso!' }, { root: true });
                    await vm.$store.dispatch('setIsChangePassword', false, { root: true });
                    vm.fechar()
                  } else {
                    await vm.$store.dispatch('app/setMessage', { type: 'info', message: (response.data && response.data.data ? response.data.data : response.data) }, { root: true });
                  }
                }).catch(async error => {
                    await vm.$store.dispatch('app/setMessage', { type: 'error', message: 'Ops! Houve algum erro ao Atualizar a senha. Erro: '+error }, { root: true });
                });
              }
            }
            vm.isSalvando = false
          }).catch (error => {
            vm.isSalvando = false
            vm.$store.dispatch('app/setMessage', { type: 'error', message: 'Ops! Houve algum erro ao Atualizar a senha. Erro: '+error }, { root: true });
          })
        } catch (error) {
          vm.isSalvando = false
          vm.$store.dispatch('app/setMessage', { type: 'error', message: 'Erro ao Salvar Dados. Erro: '+error }, { root: true });
        }
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
