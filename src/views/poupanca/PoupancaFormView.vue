<template>

    <div class="conta-form-view page-content">
      <router-link class="btn btn-primary btn-primary-custom" to="/app/cartoes"><font-awesome-icon icon="fa-solid fa-arrow-left" /> Voltar</router-link>
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
                                    <select class="form-select" v-model="data.account.account_type_id">
                                      <option value="">Selecione um tipo de conta</option>
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

import {onMounted, reactive, nextTick} from "vue";
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
          router.push({name: "poupanca"})
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
         saveAccount(store.getters.userData.user_id, data, router, 'cartoes')
         return;
       }
       updateAccount(store.getters.userData.user_id, route.params.id, router, data, 'cartoes');
      }

      onMounted(async () => {
         await listAccountTypes(data)
         await nextTick()

         data.accountTypes = data.accountTypes.filter(item =>
             item.slug_name === 'investimento' ||
             item.slug_name === 'poupanca_reserva'
         )

        if(route.params.id != null) {
             data.pageTitle = "Editar Conta"
             data.subtitle = "Edite sua conta de poupança e investimento"
             getAccountById(store.getters.userData.user_id,route.params.id, data)
             return
          }
          data.pageTitle = "Nova Conta Poupança/Investimento"
          data.subtitle="Preencha o formulário abaixo para criar uma nova conta de Poupança ou Investimento";
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