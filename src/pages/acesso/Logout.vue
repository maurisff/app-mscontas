<template>
    <v-content>
      <v-container fluid fill-height justify-center v-if="!isLoading">
        <div>
          <div>Saindo...</div>
        </div>
      </v-container>
    </v-content>
</template>

<script>
  // import app from '@/services/app'

  export default {
    name: 'Acesso.logout',
    data: () => ({
      redirect: null
    }),
    props: {
      source: String
    },
    watch: {

    },
    computed:{
      isLoading: function () {
        return (this.$store.getters['app/isLoading'])
      }      
    },
    async created() {
      await this.logout();
      setTimeout(async ()=>{
        this.$router.push({ path: '/' }).catch(() => { });
      }, 100)
    },
    mounted() {
    },
    methods:{      
      async logout (){      
        await this.$store.dispatch('authentication/logout', null, { root: true });
      },
      async voltar (){
        
      }
    }
  }
</script>
<style>
</style>
