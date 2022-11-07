import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomeView from "@/views/HomeView";
import InicioView from "@/views/InicioView";
import ContasView from "@/views/contas/ContasView";
import ContaForm from "@/views/contas/ContaFormView";
import store from "@/store";
import {checkValidToken} from "@/service/http/authService";
import Transaction from "@/views/transacoes/Transaction";

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/app',
    name: 'home',
    component: HomeView,
    redirect: 'app/dashboard',
    children : [
      {
        path: '/app/dashboard',
        name: 'dashboard',
        component: InicioView
      },
      {
        path: '/app/contas',
        name: 'contas',
        component: ContasView
      },
      {
        path: '/app/contas/new',
        name: 'contas-form',
        component: ContaForm
      },
      {
        path: '/app/contas/edit/:id',
        name: 'contas-form-edit',
        component: ContaForm
      },
      {
        path: '/app/conta/:id/transaction',
        name: 'conta-transaction',
        component: Transaction
      },
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  linkActiveClass: "active"
})

router.beforeEach((to, from) => {
    if(to.name != 'login') {
       let user = store.getters.userData;

       if(!store.getters.isAuth) {
          return router.push({name: "login"})
       }

       if(user.token === "" || !user.hasOwnProperty("token")) {
         return router.push({name: "login"})

       }

      checkValidToken(user.token).then(result => {}).catch(error => {
         store.commit("clearState")
         return router.push({name: "login"})
      })
    }
});

export default router
