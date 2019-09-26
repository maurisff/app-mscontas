<template>
    <v-content>
      <v-container fluid fill-height justify-center v-if="!isLoading">
        <div>
          <div><h4><span>OPS!!!</span> Esta opção ainda esta em contrução...</h4></div>
          <br/>
          <div>Para mais informações entre en contrato pelo email: 
            <a href="mailto:contato@mail.com" target="_top">contato@mail.com</a>
          </div>
          <div>          
            <v-btn dark class="ma-2" color="primary" @click.stop="voltar">
              <v-icon dark left>arrow_back</v-icon>Voltar
            </v-btn>
          </div>
        </div>
      </v-container>
    </v-content>
</template>

<script>
  import app from '@/services/app'

  export default {
    name: 'Acesso.Registre-se',
    data: () => ({
      redirect: null,
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
      }
      
    },
    created() {
    },
    mounted() {
      this.$validator.localize('en', this.dictionary);
    },
    methods:{
      async voltar (){
        this.$router.push({ path: '/' }).catch(() => { });
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
      async finalizar(){
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
</style>
