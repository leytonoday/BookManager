"use strict"

import Vuesax             from "vuesax"
import router             from "./router"
import store              from "./store"
import Vue                from "vue"
import App                from "./App.vue"
import                    "vuesax/dist/vuesax.css" 
import                    "./style.css"
import                    "bulma/css/bulma.css"

Vue.config.productionTip = false
Vue.use(Vuesax)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")