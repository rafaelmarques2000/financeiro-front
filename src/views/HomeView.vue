<template>
  <div class="home-view">
      <div class="sidebar">
           <div class="logo">
             <h1><font-awesome-icon icon="fa-solid fa-sack-dollar"></font-awesome-icon> Graninha 2.0</h1>
           </div>
           <nav class="sidebar-menu">
               <ul>
                 <li><router-link to="/app/dashboard"><font-awesome-icon icon="fa-solid fa-house" /> Inicio</router-link></li>
                 <li><router-link to="/app/contas"><font-awesome-icon icon="fa-solid fa-receipt" /> Contas corrente</router-link></li>
                 <li><router-link to="/app/cartoes"><font-awesome-icon icon="fa-solid fa-credit-card" /> Cartões</router-link></li>
                 <li><router-link to="/app/poupanca"><font-awesome-icon icon="fa-solid fa-sack-dollar" /> Poupança/Investimento</router-link></li>
                 <li><a href="" @click.prevent="confirmAppExit"><font-awesome-icon icon="fa-solid fa-right-from-bracket" /> Sair</a></li>
               </ul>
           </nav>
      </div>
    <div class="home-fluid">
         <nav class="home-navbar">

        </nav>
        <div class="content-center">
             <router-view></router-view>
        </div>
    </div>
  </div>
</template>

<script>

import { reactive } from "vue";
import Swal from "sweetalert2";
import {useRouter} from "vue-router/dist/vue-router";
import store from "@/store"

export default {
    setup() {

      const router = useRouter()

      const data = reactive({
          msg: "hello"
      })

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
          data,
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
     width: 100%;
     margin-top: 40px;
     display: flex;
     align-items: flex-end;
     justify-content: left;
     padding-left: 25px;
   }

   .logo h1 {
     font-size: 1em;
     font-family: 'Roboto', sans-serif;
     font-weight: bold;
   }

   .sidebar-menu ul {
       display: flex;
       flex-direction: column;
       margin-top: 30px;
       padding-left: 10px;
   }


   .sidebar-menu ul li{
       display: block;
       margin-bottom: 10px;
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
      padding-top: 15px;
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


</style>