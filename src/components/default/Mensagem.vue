<template>
	<v-container>
		<v-snackbar
			:color="color"
			:bottom="position.bottom"
			:top="position.top"
			:left="position.left"
			:right="position.right"
			:timeout="timeout"
			v-model="show"
			dark
			>
				<div class="divIcon">
					<v-icon color="white" class="mr-3" > error_outline </v-icon>
				</div>
				<div>
					<div v-if="title"><strong>{{title}}</strong></div>
					<div class="msg" >{{message}}</div>
				</div>
				<div class="divClose">
					<v-icon size="18" class="mr-3" @click="show = false"> cancel </v-icon>
				</div>
				
		</v-snackbar>
	</v-container>
</template>

<script>
export default {
  data: () => ({
		defaultTitle: 'Atenção',
		title: '',
		message: null,
		color: null,
		timeout: 0,
		readingSpeed: 100, // Words Per minutes - 100: Slow reading, 130:Average Reading, 160: Fast Reading
		minTimeout: 8000,  // 8 Seconds
		position: {
			top: true,
			bottom: false,
			left: false,
			right: true
		},
    show: false
  }),

  methods: {
    
	},
	computed: {
		onMessage(){
			return this.$store.getters['app/getMessage']
		}
  },
  watch:{
    onMessage(){
			//console.log('onMessage-Alerta de messangem: ', this.$store.getters.alertMessage)
			if (this.$store.getters['app/getMessage']){
				var payload = this.$store.getters['app/getMessage'];
        /**
				 * title: String
         * message: String
         * type: 'success', 'info', 'error', warning
         * tempo: number
         *
         */
				if (payload.type === 'error'){					
					this.title = payload.title || 'Erro'
				}else{
					this.title = payload.title || this.defaultTitle
				}
				// Formula to calculate reading time.
				payload.tempo = payload.tempo || this.minTimeout;
				var fullTextWords = this.title + ' ' + payload.message
				var arrWords = fullTextWords.split(' ');
				var wordsPerMinTimeout = Math.round((((this.minTimeout / 1000) * this.readingSpeed) / 60));
				var Multiplier = Math.round(arrWords.length /  (wordsPerMinTimeout !== 0 ? wordsPerMinTimeout : 1));
				var time = this.minTimeout * (Multiplier > 0 ? Multiplier : 1);

				this.message = payload.message;
				this.color = payload.type || 'success' // 'success', 'info', 'error', warning
				this.timeout = Math.max(time, payload.tempo, this.minTimeout	)
				this.$store.dispatch('app/clearMessage', null, { root: true });
				this.show = true
      }
    }
  }
}
</script>

<style scoped>
.msg {	
	width: 150px;
	word-wrap: break-word;
}


@media only screen and (min-width: 280px) {
  .msg {	
		width: 180px;
		word-wrap: break-word;
	}
}

@media only screen and (min-width: 320px) {
  .msg {	
		width: 200px;
		word-wrap: break-word;
	}
}

@media only screen and (min-width: 400px) {
  .msg {	
		width: 280px;
		word-wrap: break-word;
	}
}

@media only screen and (min-width: 430px) {
  .msg {	
		width: 300px;
		word-wrap: break-word;
	}
}

@media only screen and (min-width: 600px) {
  .msg {	
		width: 400px;
		word-wrap: break-word;
	}
}


.divClose{
	align-content: center;
	text-align: center;
	align-items: center
}
.divIcon{
	align-content: center;
	text-align: center;
	align-items: center
}
</style>