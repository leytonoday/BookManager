import settings from "./modules/settings"
import themes   from "./modules/themes"
import books    from "./modules/books"
import misc     from "./modules/misc"
import Vuex     from "vuex"
import Vue      from "vue"

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    settings,
    themes,
    books,
    misc
  }
})