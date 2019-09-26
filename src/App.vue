<template>
    <v-app>
      <div v-if="isLoaderStart" >
        <div class="loader">
          <div class="line one"></div>
          <div class="line two"></div>
          <div class="line three"></div>
          <div class="line four"></div>
          <div class="line five"></div>
        </div>
      </div>
      <layoutApp v-else ></layoutApp>
      <mensagemApp/>
    </v-app>
</template>


<script>
import mensagemApp from '@/components/default/Mensagem'
import layoutApp from '@/pages/layout/LayoutApp'
export default {
  name: 'App',
  components: {
    mensagemApp,
    layoutApp    
  },
  computed: {
    isLoaderStart(){
      return this.$store.getters['app/isStartingApp'];
    },
    receiverNotification(){
      if (this.$store.getters['app/getNotification']){
        var payload = this.$store.getters['app/getNotification'];
        var message = payload.notification.body;
        var options = { 
          type: 'primary',
          theme: 'bubble',
          position: 'bottom-right',
          duration: 10000,
          action : {
            text : 'X',
            onClick : (e, toastObject) => {
              toastObject.goAway(0);
            }
          }
        }
      this.$store.dispatch('app/clearNotification', null, { root: true });
      this.$toasted.info(message, options);
      }
      return this.$store.getters['app/getNotification'];
    }
  },
  watch:{
    receiverNotification(){
      // console.log('Nova notificacao...')
    }
  }
}
</script>
<style >
body {
  background: white;
}


.loader {
  width: 50px;
  height: 30px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.loader:after {
  position: absolute;
  content: "loading";
  bottom: -40px;
  left: -2px;
  text-transform: uppercase;
  font-family: "Arial";
  font-weight: bold;
  font-size: 12px;
}

.loader > .line {
  background-color: #333;
  width: 6px;
  height: 100%;
  text-align: center;
  display: inline-block;

  animation: stretch 1.2s infinite ease-in-out;
}

.line.one {
  background-color: #99DBB4;
}

.line.two {
  animation-delay:  -1.1s;
  background-color:#3498db;
}
.line.three {
  animation-delay:  -1.0s;
  background-color:#9b59b6;
}
.line.four {
  animation-delay:  -0.9s;
   background-color: #e67e22;
}
.line.five {
  animation-delay:  -0.8s;
  background-color: #e74c3c;
}

@keyframes stretch {
  0%, 40%, 100% { transform: scaleY(0.4); }
  20% {transform: scaleY(1.0);}
}
</style>
