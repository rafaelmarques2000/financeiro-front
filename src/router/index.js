import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomeView from "@/views/HomeView";
import InicioView from "@/views/InicioView";
import ContasView from "@/views/contas/ContasView";
import ContaForm from "@/views/contas/ContaFormView";
import store from "@/store";
import {checkValidToken} from "@/service/http/authService";
import Transaction from "@/views/transacoes/Transaction";
import TransactionFormView from "@/views/transacoes/TransactionFormView";
import CartoesView from "@/views/cartoes/CartoesView";
import CartoesFormView from "@/views/cartoes/CartoesFormView";
import PoupancaView from "@/views/poupanca/PoupancaView";
import PoupancaFormView from "@/views/poupanca/PoupancaFormView";
import {ReactiveData} from "@/service/utils/homedata";

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
        component: InicioView,
        meta: {
          page: "dashboard"
        }
      },
      {
        path: '/app/contas',
        name: 'contas',
        component: ContasView,
        meta: {
           page: "contas"
        }
      },
      {
        path: '/app/contas/new',
        name: 'contas-form',
        component: ContaForm,
        meta: {
          page: "contas"
        }
      },
      {
        path: '/app/contas/edit/:id',
        name: 'contas-form-edit',
        component: ContaForm,
        meta: {
          page: "contas"
        }
      },
      {
        path: '/app/conta/:id/transaction',
        name: 'conta-transaction',
        component: Transaction
      },
      {
        path: '/app/conta/:id/transaction/new',
        name: 'conta-transaction-new',
        component: TransactionFormView
      },
      {
        path: '/app/conta/:id/transaction/edit/:id_transaction',
        name: 'conta-transaction-edit',
        component: TransactionFormView
      },
      {
        path: '/app/cartoes',
        name: 'cartoes',
        component: CartoesView,
        meta: {
          page: "cartoes"
        }
      },
      {
        path: '/app/cartoes/new',
        name: 'cartoes-form',
        component: CartoesFormView,
        meta: {
          page: "cartoes"
        }
      },
      {
        path: '/app/contas/cartoes/:id',
        name: 'cartoes-form-edit',
        component: CartoesFormView,
        meta: {
          page: "cartoes"
        }
      },
      {
        path: '/app/poupanca',
        name: 'poupanca',
        component: PoupancaView,
        meta: {
          page: "poupanca"
        }
      },
      {
        path: '/app/poupanca/new',
        name: 'poupanca-form',
        component: PoupancaFormView,
        meta: {
          page: "poupanca"
        }
      },
      {
        path: '/app/poupanca/edit/:id',
        name: 'poupanca-form-edit',
        component: PoupancaFormView,
        meta: {
          page: "poupanca"
        }
      },
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from) => {
    if(to.name !== 'login') {
       let user = store.getters.userData;

       if(!store.getters.isAuth) {
          return router.push({name: "login"})
       }

       if(user.token === "" || !user.hasOwnProperty("token")) {
         return router.push({name: "login"})
       }

      checkValidToken(user.token).then(result => {
        ReactiveData.page = to.meta.page
      }).catch(error => {
         store.commit("clearState")
         return router.push({name: "login"})
      })
    }
});

export default router
