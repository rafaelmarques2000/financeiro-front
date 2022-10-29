<template>
  <div class="login-view">
      <div class="login-form-content">
        <div class="logo-content">
            <h1>Sistema de Finanças</h1>
        </div>

        <h4 class="sub-title">Seja bem vindo, insira suas credencias para começar</h4>

        <div class="login-form">
            <form>
                <div class="form-field-content" id="userfield">
                    <input type="text" v-model="data.username" placeholder="Usuário">
                </div>

              <div class="form-field-content">
                <input type="password" v-model="data.password" placeholder="Senha">
              </div>

              <button  :disabled="data.disabledBtnLogin" @click="authSubmit" class="login-btn" type="button">{{data.buttonMsg}}</button>

            </form>
        </div>
      </div>
  </div>
</template>

<script>

import {onMounted, reactive} from "vue";
import Swal from "sweetalert2";
import {useRouter} from "vue-router";
import store from "../store/index"
import httpService from "@/service/http/HttpService";
import {authenticate} from "@/service/http/authService";

export default {
    setup() {

      const router = useRouter();

      const data = reactive({
          username: null,
          password: null,
          disabledBtnLogin: false,
          buttonMsg: "Entrar"
      })

      const authSubmit = () => {
          if(!data.username) {
             Swal.fire("Atenção", "Preencha o campo Usuário", "warning", "")
             return
          }

          if(!data.password) {
            Swal.fire("Atenção", "Preencha o campo Senha", "warning", "")
            return
          }

          data.disabledBtnLogin = true;
          data.buttonMsg = "Processando Aguarde..."

          authenticate(data).then(result => {
            data.disabledBtnLogin = false;
            data.buttonMsg = "Entrar"
            store.commit("enableAuth")
            store.commit("setUserData", result.data)
            router.push({name:"home"})
          }).catch(error => {
             Swal.fire(error.response.data.message, "", "error")
             data.disabledBtnLogin = false;
             data.buttonMsg = "Entrar"
          })
      }

      onMounted(() => {})

      return {
          data,
          authSubmit
      }

    }
 }

</script>

<style scoped>
   .login-view {
      width: 100%;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
   }

   .login-form-content {
       padding: 2.3em;
       background: #fff;
       width: 300px;
       height: 350px;
   }

   .logo-content {
     width: 100%;
     text-align: left;
   }

   .logo-content h1 {
      font-size: 1.5em;
      font-family: 'Roboto', sans-serif;
   }

   .login-form {
      margin-top: 40px;
   }

   .form-field-content {
      display: flex;
      flex-direction: column;
      margin-bottom: 10px;
   }

   .form-field-content label {
     margin-bottom: 10px;
   }

   .form-field-content input {
     border: 1px solid #CED4DA;
     height: 1.175rem;
     padding: 0.94rem 1.94rem;
     outline-color: #ccc;
     font-family: 'Roboto', sans-serif;
   }

   .form-field-content input::placeholder {
      font-size: 15px;
      font-family: 'Roboto', sans-serif;
      color: #c7c7c7
   }

   #userfield {
      margin-bottom: 32px;
   }

   .sub-title {
      margin-top: 15px;
      color: #999;
      font-family: 'Roboto', sans-serif;
      font-weight: 200;
      font-size: 1em;
   }

   .login-btn {
     width: 100%;
     height: 40px;
     background-color: #4B49AC;
     border: solid 1px #4B49AC;
     font-weight: 400;
     font-size: 1em;
     color: #fff;
     margin-top: 18px;
     transition: background-color .5s;
     font-family: 'Roboto', sans-serif;

   }

   .login-btn:hover {
       cursor: pointer;
       background: #312fab;
   }

</style>