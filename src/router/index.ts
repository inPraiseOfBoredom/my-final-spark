import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Note from "../views/Note.vue";
import Register from "../views/Register.vue";
import Login from "../views/Login.vue";
import CreateNote from "../views/CreateNote.vue";
import EditNote from "../views/EditNote.vue";

import store from "../store/index";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
    beforeEnter(to, from, next) {
      if (!store.state.user) {
        return next({ name: "Login" });
      }
      next();
    },
  },
  {
    path: "/auth/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/auth/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/notes/:id",
    name: "Note",
    component: Note,
    props: true,
  },
  {
    path: "/create-note",
    name: "CreateNote",
    component: CreateNote,
  },
  {
    path: "/edit-note/:id",
    name: "EditNote",
    component: EditNote,
  },
  
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
