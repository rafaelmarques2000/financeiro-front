<template>

    <div class="conta-form-view page-content">
      <router-link class="btn btn-primary btn-primary-custom" to="/app/contas"><font-awesome-icon icon="fa-solid fa-arrow-left" /> Voltar</router-link>
      <div class="row">
                 <div class="col-12">
                      <div class="card form-page-card">
                        <page-title
                            :title="data.pageTitle"
                            page-icon="fa-solid fa-receipt"
                            :subtitle="data.subtitle"
                        ></page-title>
                           <div class="card-body page-card-body">
                                <form>
                                  <div class="mb-3">
                                    <label for="description" class="form-label">Descrição</label>
                                    <input type="text" v-model="data.account.description" class="form-control" id="description" placeholder="Digite um nome para sua conta" aria-describedby="descriptionHelp">
                                  </div>

                                  <div class="mb-3">
                                    <label for="accounttype" class="form-label">Tipo de conta</label>
                                    <select disabled class="form-select" v-model="data.account.account_type_id" aria-label="Default select example">
                                      <option v-for="item in data.accountTypes" :value="item.id">{{item.description}}</option>
                                    </select>
                                  </div>
                                  <div class="mb-3">
                                      <button style="margin-right: 10px" @click="submit" type="button" class="btn btn-primary btn-primary-custom">Concluir</button>
                                      <button type="button" @click="backPage" class="btn btn-secondary">Cancelar</button>
                                  </div>
                                </form>

                         </div>
                      </div>
                 </div>
            </div>
    </div>
</template>

<script>

import {nextTick, onMounted, reactive} from "vue";
import PageTitle from "@/components/PageTitle";
import { useRoute, useRouter } from 'vue-router'
import Swal from "sweetalert2";
import {listAccountTypes} from "@/service/http/accountTypeService"
import {getAccountById, saveAccount, updateAccount} from "@/service/http/accountService"
import store from "@/store"

export default {
    components: {PageTitle},
    setup() {

      const router = useRouter();
      const route = useRoute();

      const data = reactive({
          pageTitle: "",
          subtitle: "",
          accountTypes: [],
          account: {
             description: "",
             account_type_id: ""
          }
      })

      const backPage = () => {
          router.push({name: "contas"})
      }

      const submit = () => {
        if(!data.account.description) {
           Swal.fire("Atenção", "Preencha o campo Descrição", "warning", "")
           return
        }

        if(!data.account.account_type_id) {
          Swal.fire("Atenção", "Selecione um tipo de conta", "warning", "")
          return
        }

      if(route.params.id == null) {
         saveAccount(store.getters.userData.user_id, data, router , 'contas')
         return;
       }
       updateAccount(store.getters.userData.user_id, route.params.id, router, data, 'contas');
      }

      onMounted(async () => {
          await nextTick()
          await listAccountTypes(data)
          data.account.account_type_id = data.accountTypes.filter( item => item.slug_name === 'conta_corrente')[0].id

        if(route.params.id != null) {
             data.pageTitle = "Editar conta"
             data.subtitle = "Edite sua conta"
             getAccountById(store.getters.userData.user_id,route.params.id, data)
             return
          }
          data.pageTitle = "Nova conta"
          data.subtitle="Preencha o formulário abaixo para criar uma nova conta";
      })

      return {
          data,
          backPage,
          submit
      }
    }
 }

</script>

<style scoped>
   .conta-form-view {
      width: 100%;
      height: calc(100vh - 60px);
   }
</style>