import Vue from 'vue'
import App from './App.vue'
import router from './router'

import Amplify, * as AmplifyModuls from 'aws-amplify';
import { AmplifyPlugin } from 'aws-amplify-vue';
import aws_exports from './aws-exports';
import  store  from './store'
Amplify.configure(aws_exports);
Vue.use(AmplifyPlugin, AmplifyModuls);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
