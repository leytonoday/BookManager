import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "../store"

// Solution for NavigationDuplication error
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function(location) { originalPush.call(this, location).catch(err => err) }

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue")
  },
  {
    path: "/bookscardview",
    name: "BookCardsView",
    component: () => import("../views/BooksCardView.vue")
  },
  {
    path: "/bookstableview",
    name: "BookTable",
    component: () => import("../views/BooksTableView.vue")
  },
  {
    path: "/books/:id",
    name: "Book",
    props: true,
    beforeEnter: (to, from, next) => {
      if(!store.getters.bookFromId(to.params.id)) next("*") // if the user attemps to go to a book that doesn't exists, send them to "*" (not found)
      else next()
    },
    component: () => import("../views/Book.vue"),
  },
  {
    path: "/addbookauto",
    name: "AddBookAuto",
    component: () => import("../views/AddBookAuto.vue")
  },
  {
    path: "/addbookmanual",
    name: "AddBookManual",
    component: () => import("../views/AddBookManual.vue")
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("../views/Settings.vue")
  },
  {
    path: "/statistics",
    name: "Statistics",
    component: () => import("../views/Statistics.vue")
  },
  {
    path: "*",
    name: "NotFound",
    component: () => import("../views/NotFound.vue")
  },
]

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
