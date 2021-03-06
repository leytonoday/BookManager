import VueRouter  from 'vue-router'
import store      from "../store"
import Vue        from 'vue'

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
    path: "/bookscardview/:category",
    name: "BookCardsView",
    props: true,
    component: () => import("../views/BooksCardView.vue")
  },
  {
    path: "/bookstableview",
    name: "BookTable",
    component: () => import("../views/BooksTableView.vue")
  },
  {
    path: "/bookscategoryview",
    name: "BooksCategroyView",
    component: () => import("../views/BooksCategoryView.vue")
  },
  {
    path: "/booksgroupsview",
    name: "BooksGroupsView",
    component: () => import("../views/Group/BooksGroupsView.vue")
  },
  {
    path: "/creategroup",
    name: "CreateGroup",
    component: () => import("../views/Group/CreateGroup.vue")
  },
  {
    path: "/booksgroupview/:group",
    name: "BooksGroupView",
    props: true,
    component: () => import("../views/Group/BooksGroupView.vue")
  },
  {
    path: "/books/:id",
    name: "Book",
    props: true,
    beforeEnter: (to, _, next) => {
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
    path: "/help",
    name: "Help",
    component: () => import("../views/Help.vue")
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
  routes,
  scrollBehavior () {
    document.getElementById('app').scrollIntoView() // Router-links preserve the scroll position, so scroll to the top of the page on route change
  }
})

export default router
