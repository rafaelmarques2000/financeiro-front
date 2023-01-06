<template>
  <div class="home-view">
    <div class="home-fluid">
         <nav class="home-navbar">
           <div class="logo">
             <h1><font-awesome-icon icon="fa-solid fa-sack-dollar"></font-awesome-icon> Graninha 3.0</h1>
           </div>

           <nav class="sidebar-menu">
             <ul>
               <li><router-link to="/app/dashboard" :class="{'active-nav-menu': ReactiveData.page === 'dashboard'}"><font-awesome-icon icon="fa-solid fa-chart-line" /> Dash</router-link></li>
               <li><router-link to="/app/contas"    :class="{'active-nav-menu': ReactiveData.page === 'contas'}"><font-awesome-icon icon="fa-solid fa-receipt" /> Contas</router-link></li>
               <li><router-link to="/app/cartoes"   :class="{'active-nav-menu': ReactiveData.page === 'cartoes'}"><font-awesome-icon icon="fa-solid fa-credit-card" /> Cartões</router-link></li>
               <li><router-link to="/app/poupanca"  :class="{'active-nav-menu': ReactiveData.page === 'poupanca'}"><font-awesome-icon icon="fa-solid fa-piggy-bank" /> Cofrinhos</router-link></li>
             </ul>
           </nav>

           <div class="menu-nav-container">
              <a href="" @click.prevent="confirmAppExit" class="btn btn-danger btn-exit"><font-awesome-icon icon="fa-solid fa-right-from-bracket" /> Sair</a>
           </div>

         </nav>
        <div class="content-center">
          <router-view v-slot="{ Component }">
            <transition name="slideback">
               <component :is="Component" />
            </transition>
          </router-view>
        </div>
    </div>
  </div>
</template>

<script>

import Swal from "sweetalert2";
import store from "@/store"
import {useRoute, useRouter} from "vue-router";
import {ReactiveData} from "@/service/utils/homedata";

export default {
    setup() {

      const router = useRouter()
      const route = useRoute()

      const confirmAppExit = () => {
        Swal.fire({
          title: 'Confirmação',
          text: `Deseja sair do sistema ? `,
          icon: 'question',
          showConfirmButton: true,
          confirmButtonText: "Sim",
          showCancelButton: true,
          cancelButtonText: "Não",
        }).then(result => {
          if(result.isConfirmed) {
            store.commit("clearState")
            router.push({name: "login"})
          }
        })
      }

      return {
          ReactiveData,
          confirmAppExit
      }

    }
 }

</script>

<style scoped>
   .home-view {
      width: 100%;
      height: 100vh;
      display: flex;
   }

   .sidebar {
      background: #ffffff;
      width: 260px;
   }

   .logo {
     width: 200px;
     margin-top: 11px;
     padding-left: 25px;
   }

   .logo h1 {
     font-size: 1em;
     font-family: 'Roboto', sans-serif;
     font-weight: bold;
     width: 120px;
   }

   .sidebar-menu ul {
       display: flex;
       flex-direction: row;
   }

   .sidebar-menu ul li {
     display: block;
     overflow: hidden;
     width: 150px;
     text-align: center;
   }


   .sidebar-menu ul li a:link,.sidebar-menu ul li a:visited,.sidebar-menu ul li a:active{
      text-decoration: none;
      color:#4B49AC;
      font-size: 0.9em;
      font-family: 'Roboto', sans-serif;
      font-weight: 300;
      display: block;
      width: calc(100% - 20px) ;
      padding: 10px;
   }

   .sidebar-menu ul li a:hover {
      color:#fff;
      background: #4B49ACFF;
   }

   .content-center {
      width: 100%;
      height: 100vh;
      overflow: auto;
   }

   .home-navbar {
      width: 100%;
      height: 60px;
      background: #ffffff;
      padding-left: 15px;
      padding-top: 10px;
      box-sizing: border-box;
      color:#000;
      font-family: 'Roboto', sans-serif;
     -moz-box-shadow:0 5px 5px rgba(182, 182, 182, 0.75);
     -webkit-box-shadow: 0 5px 5px rgba(182, 182, 182, 0.75);
      box-shadow: 0 5px 5px rgba(182, 182, 182, 0.75);
      display: flex;
   }

   .home-fluid {
      display: flex;
      flex-direction: column;
      width: 100%;
   }

   .menu-nav-container {
     width: 100%;
     display: flex;
     justify-content: flex-end;
     box-sizing: border-box;
   }

   .btn-exit{
     margin-bottom: 10px;
     margin-right: 9px;
   }

</style>