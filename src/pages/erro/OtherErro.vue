<template>
    <div>
        <div v-if="urlNotFound" >OOPS!!! Pagina{{(urlNotFound ? ' '+urlNotFound : null)}} não Encontra!</div>
        <div >{{(message ?  `Erro: ${message}`: '')}}</div>
        <br/>
        <a href="/" >Home</a>
    </div>
</template>
<script>

export default {
  name: 'OtherErro',
  data() {
    return {
      urlNotFound: null
    }
  },
  computed: {
    message() {
      return this.$store.getters['app/getErro']
    }
  },
  created: function() {
      // Redirect outside the app using plain old javascript
      //window.location.href = "/404.html";
      if (this.$route.query.urlNotFound){
        this.urlNotFound = this.$route.query.urlNotFound;
      }
      if (!this.urlNotFound && ! this.message )
        this.$router.push({ path: '/' }).catch(() => { console.info('push.catch7'); });
  }
}
</script>
<style scoped>
</style>
