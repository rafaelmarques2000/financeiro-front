<template>
  <div class="page-view page-content">

     <router-link class="btn btn-primary btn-primary-custom" :to="`/app/${data.lastRoute}`"><font-awesome-icon icon="fa-solid fa-arrow-left" /> Voltar</router-link>
     <div class="card page-card">
         <page-title
             :title="`Transações - ${data.accountDetails.description}`"
             :subtitle="`Tipo - ${data.accountDetails.type}`"
             page-icon="fa-solid fa-receipt"
         ></page-title>

       <div class="alert alert-primary label-top">
           <div class="row">
               <div v-for="item in data.statistics" class="col-3">
                   <h4 class="tipo-transacao-label">{{ item.description }}</h4>
                    <span class="value-label normal-label" :class="{
                      'negative-label': item.amount < 0,
                      'positive-label': item.amount > 0,
                    }">{{item.amount.toLocaleString("pt-BR", {style: "currency", currency :"BRL"})}}</span>
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
             <option value="50">50</option>
             <option value="100">100</option>
           </select>
         </div>
       </div>
       <div class="filter-body" :class="{'filter-body-open': data.isOpenFilter}">
         <div class="row">
           <div class="col-4">
             <label class="form-label">Descrição</label>
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
                   <span style="padding: 10px">até</span>
                   <input
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
         <no-content message="Ainda não há transações para esta conta" v-if="!data.transactions.length"></no-content>
           <table class="table" v-else>
             <tr class="page-table-header">
               <th>Descrição</th>
               <th>Data</th>
               <th>Tipo</th>
               <th>Categoria</th>
               <th>Valor</th>
               <th>Parcelado</th>
               <th>Qtd.Parcelas</th>
               <th>N.Parcela</th>
               <th></th>
             </tr>
             <tr v-for="item in data.transactions" class="page-table-row">
                 <td>{{ item.description }}</td>
                 <td>{{item.date}}</td>
                 <td v-if="item.transaction_type.slug_name === 'receita'"><span class="badge rounded-pill text-bg-primary" style="background: #3c9536!important;">{{item.transaction_type.description}}</span></td>
                 <td v-else><span class="badge rounded-pill text-bg-primary" style="background: #a81616!important;">{{item.transaction_type.description}}</span></td>
                 <td>{{item.category.description}}</td>


                 <td v-if="item.transaction_type.slug_name === 'receita'"><span class="positive-label">+ {{item.amount.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}}</span> </td>
                 <td v-else > <span class="negative-label"> - {{item.amount.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}}</span> </td>

                 <td>{{item.installment ? 'Sim':'Não'}}</td>
                 <td>{{item.amount_installment == null ? '-': item.amount_installment}}</td>
                 <td>{{item.current_installment == null ? '-': item.current_installment}}</td>
                 <td>
                   <div class="row-btn-actions">
                     <button type="button" @click="openForm(item.id)" class="btn btn-primary btn-primary-custom"><font-awesome-icon icon="fa-solid fa-pen-to-square" /></button>
                     <button type="button" @click="deletePrompt(item.description, item.id)" class="btn btn-outline-danger"><font-awesome-icon icon="fa-solid fa-trash" /></button>
                   </div>
                 </td>
             </tr>

           </table>
       </div>
       <div class="row" v-if="data.transactions.length" style="padding: 20px">
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
</template>

<script>
import {computed, onMounted, reactive, watch} from "vue";
import PageTitle from "@/components/PageTitle";
import NoContent from "@/components/NoContent";
import {useRoute, useRouter} from "vue-router"
import {deleteTransaction, getAccountDetail, getAccountTransactions} from "@/service/http/TransactionService";
import store from "@/store";
import {generatePagesArray} from "@/service/utils/Pagination";
import Swal from "sweetalert2";
import {showAlert} from "@/service/utils/alertsService";
import {getAccountPeriodStatistic} from "@/service/http/accountStatisticService";

export default {
  name: "Transaction",
  components: {PageTitle, NoContent},
  setup() {

    const route = useRoute();
    const router = useRouter();

    let data = reactive({
       transactions:[],
       statistics: {},
       lastRoute: null,
       accountDetails: {
           description: null,
           type: null
       },
       isOpenFilter: true,
       filters: {
          range: "",
          description: ""
       },
       pagination : {
        pages: [],
        limit: 10,
        current_page:1,
        totalPages: 0,
        totalRows: 0
      }
    })

    watch(() => data.transactions , (transactions) => {
      if(data.pagination.current_page > 1 && transactions.length === 0) {
        data.pagination.current_page-=1
        getAccountTransactions(store.getters.userData.user_id, route.params.id, data)
      }
      data.pagination.pages = generatePagesArray(data.pagination.current_page, data.pagination.totalRows, data.pagination.limit, 8)
    })

    const navigatePages = (direction) =>{
      if(direction === 'prev') {
        if(data.pagination.current_page > 1) {
          data.pagination.current_page -=1
          getAccountTransactions(store.getters.userData.user_id, route.params.id, data)
          return;
        }
      }

      if(direction === 'next') {
        if(data.pagination.current_page >= data.pagination.totalPages) {
          return
        }
        data.pagination.current_page +=1
        getAccountTransactions(store.getters.userData.user_id, route.params.id, data)
      }
    }

    const linkNavigationPage = (page) => {
        data.pagination.current_page = page
        getAccountTransactions(store.getters.userData.user_id, route.params.id, data)
    }

    const changeLimitPerPage = () => {
      getAccountTransactions(store.getters.userData.user_id, route.params.id, data)
    }

    let deletePrompt = (descricao, transactionId) => {
      Swal.fire({
        title: 'Confirmação',
        text: `Deseja deletar a transação descrita como ${descricao}?`,
        icon: 'question',
        showConfirmButton: true,
        confirmButtonText: "Sim",
        showCancelButton: true,
        cancelButtonText: "Não",
      }).then(result => {
        if(result.isConfirmed) {
          deleteTransaction(store.getters.userData.user_id,route.params.id, transactionId, data)
        }
      })
    }

    let openFilter = () => {
      if(!data.isOpenFilter) {
        data.isOpenFilter = true;
        return
      }
      data.isOpenFilter = false;
    }

    let openForm = (id) => {
      if(id != null) {
        router.push({name: "conta-transaction-edit", params:{id_transaction:id}})
        return
      }
      router.push({name: "conta-transaction-new"})
    }

    const calculatedAmount = computed(() => {
         let receita = 0;
         let despesa = 0;
         let statics = data.statistics
         for(let i = 0; i<statics.length;i++) {
             if(statics[i].description === "Despesa") {
                despesa = statics[i].total * -1
             }else{
                receita = statics[i].total
             }
         }
         let sal = receita + (despesa)
         return (sal / 100).toLocaleString("pt-BR", {style: "currency", currency: "BRL"})
    })

    const searchFilter = () => {
        if(data.filters.range == null) {
            showAlert("Preencha os filtros de data", "error")
            return
        }
        store.commit('setDateFilterRange', data.filters.range)
        store.commit('setFilterDescription', data.filters.description)
        getAccountPeriodStatistic(store.getters.userData.user_id, route.params.id, data)
        getAccountTransactions(store.getters.userData.user_id, route.params.id, data)
    }

    onMounted(() => {
      const now = new Date();
      const range = {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0)
      }

      if(store.getters.getDateFilterRange != null) {
        data.filters.range = store.getters.getDateFilterRange
        data.filters.description = store.getters.getFilterDescription
      }else {
        store.commit('setDateFilterRange', range)
        store.commit('setFilterDescription', data.filters.description)
        data.filters.range = range
      }
      data.lastRoute = store.getters.getLastRoute
      getAccountPeriodStatistic(store.getters.userData.user_id, route.params.id, data)
      getAccountDetail(store.getters.userData.user_id, route.params.id, data)
      getAccountTransactions(store.getters.userData.user_id, route.params.id, data)
    })

    return {
       data,
       linkNavigationPage,
       navigatePages,
       changeLimitPerPage,
       openFilter,
       deletePrompt,
       openForm,
       calculatedAmount,
       searchFilter
    }

  }
}
</script>

<style scoped>

</style>