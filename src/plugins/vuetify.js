import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@fortawesome/fontawesome-free/css/all.css'

import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import pt from 'vuetify/es5/locale/pt';
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify);

export default new Vuetify({
    lang: {
      locales: { pt },
      current: 'pt',
    },
  icons: {
    iconfont: 'md',
  },
});
