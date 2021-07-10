import themes from "./modules/themes"
import books  from "./modules/books"
import Vuex   from "vuex"
import Vue    from "vue"

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    books,
    themes,
  }
})