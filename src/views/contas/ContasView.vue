<template>
    <div class="contas-view page-content">
            <div class="row">
                 <div class="col-12">
                      <div class="card page-card">
                        <page-title
                            title="Contas"
                            page-icon="fa-solid fa-receipt"
                            subtitle="Gerencie suas contas"
                            style="padding: 20px"
                        ></page-title>
                        <div class="alert alert-primary label-top">
                          <div class="row">
                            <div class="col-3">
                              <h4 class="tipo-transacao-label">Saldo total</h4>
                              <span v-if="isNegativeAmount" class="value-label negative-label">{{totalAmountAccounts}}</span>
                              <span v-else class="value-label positive-label">{{totalAmountAccounts}}</span>
                            </div>
                          </div>
                        </div>
                        <div class="page-action">
                          <button class="btn btn-primary btn-primary-custom" type="button" @click="openForm(null)"><font-awesome-icon icon="fa-solid fa-circle-plus" /></button>
                          <button class="btn btn-secondary" type="button" @click="openFilter"><font-awesome-icon icon="fa-solid fa-filter" /></button>
                          <div class="show-per-page">
                              <select @change="changeLimitPerPage" v-model="data.pagination.limit" class="form-select show-pages">
                                   <option value="5">5</option>
                                   <option value="10">10</option>
                                   <option value="15">15</option>
                                   <option value="50">50</option>
                                   <option value="100">100</option>
                              </select>
                          </div>
                        </div>

                        <div class="filter-body" :class="{'filter-body-open': data.isOpenFilter}">
                          <div class="row">
                            <div class="col-6">
                              <label class="form-label">Descri????o</label>
                              <div class="input-group">
                                <input type="text" v-model="data.filters.description" class="form-control">
                              </div>
                            </div>
                            <div class="col-4">
                              <label class="form-label">Data</label>
                                 <v-date-picker
                                     v-model="data.filters.range"
                                     mode="date"
                                     is-range
                                 >
                                   <template v-slot="{ inputValue, inputEvents, isDragging }">
                                     <div style="display: flex">
                                       <input class="form-control" style="margin-right: 10px"
                                           :value="inputValue.start"
                                           v-on="inputEvents.start"
                                       />
                                       <span style="padding: 10px">at??</span>
                                       <input disabled
                                           class="form-control"
                                           :value="inputValue.end"
                                           v-on="inputEvents.end"
                                       />
                                     </div>
                                   </template>
                                 </v-date-picker>
                            </div>
                            <div class="col-2">
                              <button type="button" @click="searchFilter" style="margin-top: 25px" class="btn btn-primary btn-primary-custom">
                                <font-awesome-icon icon="fa-solid fa-search"></font-awesome-icon>
                              </button>
                            </div>
                          </div>
                        </div>

                           <div class="card-body page-card-body">
                                <no-content message="Ainda n??o h?? contas cadastradas, clique adicionar para cria sua primeira conta" v-if="!data.contas.length"></no-content>
                                <table class="table table-striped" v-if="data.contas.length">
                                    <tr class="page-table-header">
                                        <th>Descri????o</th>
                                        <th>Tipo</th>
                                        <th>Saldo</th>
                                        <th>??ltima atualiza????o</th>
                                        <th></th>
                                    </tr>
                                    <tr v-for="item in data.contas" class="page-table-row">
                                      <td @click="openTransactions(item.id, item.description)">{{item.description}}</td>
                                      <td @click="openTransactions(item.id, item.description)"><span class="badge rounded-pill text-bg-primary" :style="`background:${item.accountType.color}!important`">{{ item.accountType.description }}</span></td>
                                      <td @click="openTransactions(item.id, item.description)" v-if="item.amount > 0"><span class="positive-label">+{{item.amount.toLocaleString("pt-BR", {style: "currency", currency :"BRL"})}}</span></td>
                                      <td @click="openTransactions(item.id, item.description)" v-else-if="item.amount < 0"><span class="negative-label">{{item.amount.toLocaleString("pt-BR", {style: "currency", currency :"BRL"})}}</span></td>
                                      <td @click="openTransactions(item.id, item.description)" v-else><span class="normal-label">{{item.amount.toLocaleString("pt-BR", {style: "currency", currency :"BRL"})}}</span></td>
                                      <td @click="openTransactions(item.id, item.description)">{{formatDateAndHour(item.updated_at)}}</td>
                                      <td>
                                         <div class="row-btn-actions">
                                              <button type="button" @click="openForm(item.id)" class="btn btn-primary btn-primary-custom"><font-awesome-icon icon="fa-solid fa-pen-to-square" /></button>
                                              <button type="button" @click="deletePrompt(item.description, item.id)" class="btn btn-outline-danger"><font-awesome-icon icon="fa-solid fa-trash" /></button>
                                         </div>
                                      </td>
                                    </tr>
                                </table>
                           </div>
                        <div class="row" v-if="data.contas.length" style="padding: 20px">
                          <div class="col-12">
                            <nav aria-label="Page navigation example">
                              <ul class="pagination">
                                <li class="page-item"><a @click.prevent="navigatePages('prev')" class="page-link" href="#">Anterior</a></li>
                                <li v-for="page in data.pagination.pages" class="page-item">
                                  <span class="page-link" v-if="page === '...'">...</span>
                                  <a v-else @click.prevent="linkNavigationPage(page)" class="page-link" :class="{active: data.pagination.current_page === page}" href="#">{{page}}</a>
                                </li>
                                <li class="page-item"><a @click.prevent="navigatePages('next')" class="page-link" href="#">Proximo</a></li>
                              </ul>
                            </nav>
                          </div>
                        </div>
                      </div>
                 </div>
            </div>

    </div>
</template>

<script>

import {computed, onMounted, reactive, watch} from "vue";
import {useRouter} from "vue-router"
import {deleteAccount, listAll} from "@/service/http/accountService";
import {generatePagesArray} from "@/service/utils/Pagination";
import {formatDateAndHour} from "@/service/utils/date";

import PageTitle from "@/components/PageTitle";
import NoContent from "@/components/NoContent";
import Swal from 'sweetalert2'
import store from "@/store"
import {getAccountPeriodGeneralStatistic} from "@/service/http/accountStatisticService";


export default {
    components: {PageTitle, NoContent, },
    setup() {

      const router = useRouter();

      const data = reactive({
         contas : [],
         isOpenFilter: true,
         statistics: {},
         listFilter: {
            isCreditCard: false,
            isConta: true,
            isReserva: false
         },
         filters: {
            range: null,
            description: null
         },
         pagination : {
           pages: [],
           limit: 15,
           current_page:1,
           totalPages: 0,
           totalRows: 0
         }
      })

      watch(() => data.contas , (contas) => {
          if(data.pagination.current_page > 1 && contas.length === 0) {
            listAll(store.getters.userData.user_id, data.pagination.limit, data.pagination.current_page - 1, data)
          }
          data.pagination.pages = generatePagesArray(data.pagination.current_page, data.pagination.totalRows, data.pagination.limit, 8)
      })

      let openFilter = () => {
          if(!data.isOpenFilter) {
             data.isOpenFilter = true;
             return
          }
          data.isOpenFilter = false;
      }

      let openForm = (id) => {
         if(id != null) {
           router.push({name: "contas-form-edit", params:{id}})
           return
         }
         router.push({name: "contas-form"})
      }

      let deletePrompt = (descricaoConta, accountId) => {
        Swal.fire({
          title: 'Confirma????o',
          text: `Deseja deletar a conta ${descricaoConta}?`,
          icon: 'question',
          showConfirmButton: true,
          confirmButtonText: "Sim",
          showCancelButton: true,
          cancelButtonText: "N??o",
        }).then(result => {
             if(result.isConfirmed) {
                 deleteAccount(store.getters.userData.user_id,accountId, data)
                 getAccountPeriodGeneralStatistic(store.getters.userData.user_id, data)
             }
        })
      }

      const navigatePages = (direction) =>{
          if(direction === 'prev') {
            if(data.pagination.current_page > 1) {
               data.pagination.current_page -=1
               listAll(store.getters.userData.user_id, data.pagination.limit, data.pagination.current_page, data)
               return;
            }
          }

          if(direction === 'next') {
            if(data.pagination.current_page >= data.pagination.totalPages) {
              return
            }
            data.pagination.current_page +=1
            listAll(store.getters.userData.user_id, data.pagination.limit, data.pagination.current_page, data)
          }
      }

      const changeLimitPerPage = () => {
        listAll(store.getters.userData.user_id, data.pagination.limit, data.pagination.current_page, data)
      }

      const linkNavigationPage = (page) => {
        listAll(store.getters.userData.user_id, data.pagination.limit, page, data)
      }

      const searchFilter = () => {
        if(data.filters.range == null) {
           Swal.fire("Informe um periodo no filtro de busca", '', 'error')
           return;
        }
        store.commit("setDateFilterRange", data.filters.range)
        getAccountPeriodGeneralStatistic(store.getters.userData.user_id, data)
        listAll(store.getters.userData.user_id, data.pagination.limit, data.pagination.current_page, data)
      }

      const openTransactions = (id, description) => {
        router.push({
          name:"conta-transaction",
          params: {id}
        })
      }

      const totalAmountAccounts = computed(() => {
         let total = data.statistics.period_amount /100;
         return total.toLocaleString("pt-BR", {style: "currency", currency :"BRL"});
      })

      const isNegativeAmount = computed(() => {
         return data.statistics.period_amount < 0;
      })

      onMounted(() => {
        const now = new Date();
        const range = {
           start: new Date(now.getFullYear(), now.getMonth(), 1),
           end: new Date(now.getFullYear(), now.getMonth() + 1, 0)
        }

        if(store.getters.getDateFilterRange != null) {
          data.filters.range = store.getters.getDateFilterRange
        }else {
          store.commit('setDateFilterRange', range)
          data.filters.range = range
        }
        store.commit("setLastRoute", "contas")
        getAccountPeriodGeneralStatistic(store.getters.userData.user_id, data)
        listAll(store.getters.userData.user_id, data.pagination.limit, data.pagination.current_page, data)
      })

      return {
          data,
          openForm,
          openFilter,
          deletePrompt,
          navigatePages,
          changeLimitPerPage,
          linkNavigationPage,
          searchFilter,
          openTransactions,
          formatDateAndHour,
          totalAmountAccounts,
          isNegativeAmount
      }

    }
 }

</script>

<style scoped>
   .contas-view {
      width: 100%;
      height: calc(100vh - 60px);
   }
</style>