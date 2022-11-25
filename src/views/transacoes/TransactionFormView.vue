<template>
    <div class="conta-form-view page-content">
      <router-link class="btn btn-primary btn-primary-custom" :to="`/app/conta/${$route.params.id}/transaction`"><font-awesome-icon icon="fa-solid fa-arrow-left" /> Voltar</router-link>
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
                                 <div class="row space-rows">
                                  <div class="col-6">
                                    <label for="description" class="form-label">Descrição</label>
                                    <input type="text" v-model="data.transaction.description"  class="form-control" id="description" placeholder="Digite um nome para sua conta" aria-describedby="descriptionHelp">
                                  </div>

                                   <div class="col-6">
                                     <label for="date" class="form-label">Data</label>
                                     <input type="date" v-model="data.transaction.date" class="form-control" id="date" placeholder="Digite um nome para sua conta" aria-describedby="descriptionHelp">
                                   </div>
                                 </div>

                                  <div class="row space-rows">
                                    <div class="col-6">
                                      <label for="tipo" class="form-label">Tipo</label>
                                      <select class="form-select" v-model="data.transaction.transaction_type">
                                          <option value="">Selecione um tipo</option>
                                          <option v-for="item in data.transactionTypes" :value="item.id">{{item.description}}</option>
                                      </select>
                                    </div>

                                    <div class="col-6">
                                        <label for="valor" class="form-label">Valor</label>
                                        <CurrencyInput :options="{ currency: 'BRL' }" v-model="data.transaction.amount" class="form-control"></CurrencyInput>
                                    </div>
                                  </div>

                                  <div class="row space-rows">
                                    <div class="col-6">
                                      <label for="categoria" class="form-label">Categoria</label>
                                      <select class="form-select" v-model="data.transaction.transaction_category" :disabled="data.selectStates.categoryDisable">
                                        <option value="">Selecione uma categoria</option>
                                        <option v-for="item in data.transactionCategories" :value="item.id">{{item.description}}</option>
                                      </select>
                                    </div>
                                    <div class="col-3" v-if="!data.disableInstallment">
                                      <label for="categoria" class="form-label">Parcelamento ?</label>
                                      <select class="form-select" v-model="data.transaction.installment">
                                        <option value="false">Não</option>
                                        <option value="true">Sim</option>
                                      </select>
                                    </div>
                                    <div class="col-1" v-if="!data.disableInstallment">
                                      <label for="parcelas" class="form-label">Parcelas</label>
                                      <input type="text" v-model="data.transaction.amount_installments" class="form-control" :disabled="data.selectStates.installmentDisable" id="parcelas" placeholder="Parcelas">
                                    </div>
                                  </div>

                                 <div class="row">
                                    <div class="mb-3">
                                        <button style="margin-right: 10px" @click="submit(false)" type="button" class="btn btn-primary btn-primary-custom">Salvar</button>
                                        <button style="margin-right: 10px" v-if="data.page.transactionId == null" @click="submit(true)" type="button" class="btn btn-primary btn-primary-custom">Salvar e continuar</button>
                                        <button type="button" @click="backPage" class="btn btn-secondary">Cancelar</button>
                                    </div>
                                 </div>
                                </form>

                         </div>
                      </div>
                 </div>
            </div>
    </div>
</template>

<script>

import {onMounted, reactive, watch} from "vue";
import PageTitle from "@/components/PageTitle";
import {useRoute, useRouter} from 'vue-router'
import store from "@/store"
import {listTransactionType} from "@/service/http/TransactionTypeService";
import {listTransactionCategories} from "@/service/http/TransactionCategoriesService";
import {showAlert} from "@/service/utils/alertsService";
import {getTransactionById, saveTransaction, updateTransaction} from "@/service/http/TransactionService";
import CurrencyInput from "@/components/CurrencyInput";

export default {
    components: {CurrencyInput, PageTitle},
    setup() {

      const router = useRouter();
      const route = useRoute();

      const data = reactive({
          page: {
              transactionId: route.params.id
          },
          pageTitle: "",
          subtitle: "",
          transactionTypes: [],
          transactionCategories: [],
          disableInstallment:false,
          inputLabels: [
              "Descrição", "Data" , "Tipo", "Valor", "Categoria", "Quantidade"
          ],
          selectStates: {
            categoryDisable: true,
            installmentDisable: true
          },
          transaction: {
             description: "",
             date: "",
             transaction_type:"",
             amount: null,
             transaction_category: "",
             installment: "false",
             amount_installments: 0
          }
      })

      const backPage = () => {
          router.push({name: "conta-transaction", params: {id: route.params.id}})
      }

      const submit = (clearForm) => {

        let properties = Object.getOwnPropertyNames(data.transaction);

        for(let i=0; i<properties.length; i++) {
           if(data.transaction[properties[i]] === "" || data.transaction[properties[i]] == null) {
             showAlert(`Preencha o campo ${data.inputLabels[i]}`, 'error')
             return;
           }
           if(properties[i] === "installment" &&
               data.transaction['installment'] === "true"
               && data.transaction.amount_installments === 0
               && data.disableInstallment === false) {
             showAlert(`Numero de parcelas inválido`, 'error')
             return;
           }
        }

      if(route.params.id_transaction == null) {
         saveTransaction(store.getters.userData.user_id, route.params.id, data, router, clearForm)
         return;
       }
        updateTransaction(store.getters.userData.user_id, route.params.id, route.params.id_transaction, data, router)
      }

      watch(() => data.transaction.transaction_type , (transaction_type) => {
          if(transaction_type === "") {
              data.selectStates.categoryDisable = true;
              data.transactionCategories = []
              return
          }
          data.selectStates.categoryDisable = false
          listTransactionCategories(data)
      })

      watch(() => data.transaction.installment, (isInstalment) => {
          if(isInstalment === "true") {
             data.selectStates.installmentDisable = false
             return
          }
          data.transaction.amount_installments = 0
          data.selectStates.installmentDisable = true
      })

      onMounted(() => {
          listTransactionType(data)
          if(route.params.id_transaction != null) {
             data.pageTitle = "Editar Transação"
             data.subtitle = "Edite sua transação"
             data.disableInstallment = true
             getTransactionById(store.getters.userData.user_id, route.params.id, route.params.id_transaction, data)
             return
          }
          data.disableInstallment = false
          data.pageTitle = "Nova Transação"
          data.subtitle="Preencha o formulário abaixo para criar uma nova transação";
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