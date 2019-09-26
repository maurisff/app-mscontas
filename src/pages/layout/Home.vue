<template>
<v-container>
  <v-card v-if="(userLogado && userLogado.admin)">
  <div>
    <inputPessoa v-model="pessoa" ></inputPessoa>
    <pre>
      Usuario: {{ (userLogado && userLogado.admin ? userLogado : 'Pagina inicial' )}}
      Negócio: {{ (user && user.usuario.admin ? user.negocio : null )}}
      Pessoa: {{pessoa}}
    </pre>
  </div>
  </v-card>
</v-container>
  <!-- <v-parallax src="/static/img/maxpig_fundo.png">
  </v-parallax> -->
</template>
<script>
  
  import inputPessoa from '@/components/cadastro/Pessoa/inputPessoa'
export default {
  name: 'Home',
  components: {
    inputPessoa,
  },
  data(){
    return {
      pessoa: null
    }
  },
  watch:{
    pessoa(val){
      console.log('home.pessoa: ', val)
    }
  },
  methods:{
    getFullPach: function () {
      return (this.$route.path)
    }
  },
  mounted(){
    //console.log('Home Mounted!!');
    //this.fetchDataBilhetes();
  },
  created() {
    var vm = this;
    //console.log('Home Created!!');
    vm.$store.dispatch('app/setLoading', true, { root: true });
    setTimeout(function(){ vm.$store.dispatch('app/setLoading', false, { root: true }); }, 1000);
  },
  computed: {
    userLogado(){
      return ((this.$store.getters['authentication/authUser'] && this.$store.getters['authentication/authUser'].usuario) ? this.$store.getters['authentication/authUser'].usuario : null)
    },
    user(){
      return (this.$store.getters['authentication/authUser'] ? this.$store.getters['authentication/authUser'] : null)
    },
    isUserLogado () {
      return ((this.$store.getters['authentication/authUser'] !== null && this.$store.getters['authentication/authUser'] !== undefined))
    },
    isLoading: function () {
      return (this.$store.getters['app/isLoading'])
    },
    onResize (){  
      return this.$vuetify.breakpoint;
    }
  }
}

</script>

<style scoped>

.numberCircleMega {
  display: inline-block;
  border-radius: 50%;
  padding: 6px;
  background: #228B22;
  border: 0px solid #666;
  color: #ffffff;
  text-align: center;

  font: 16px Arial, sans-serif;
}
.numberCircleLoto {
  display: inline-block;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  padding: 6px;

  background: #9f00ad;
  border: 0px solid #666;
  color: #ffffff;
  text-align: center;

  font: 12px Arial, sans-serif;
}
.divCenter{
    text-align: center
}

.progress-circular{
  margin: 1rem
}
</style>
