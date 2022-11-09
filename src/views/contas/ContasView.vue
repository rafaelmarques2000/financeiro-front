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
                            <div class="col-6">
                              <label class="form-label">Descrição</label>
                              <div class="input-group">
                                <input type="text" v-model="data.filters.description" class="form-control">
                                <button type="button" @click="searchFilter" class="btn btn-primary btn-primary-custom">
                                    <font-awesome-icon icon="fa-solid fa-search"></font-awesome-icon>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                           <div class="card-body page-card-body">
                                <no-content message="Ainda não há contas cadastradas, clique adicionar para cria sua primeira conta" v-if="!data.contas.length"></no-content>
                                <table class="table table-hover" v-if="data.contas.length">
                                    <tr class="page-table-header">
                                        <th>Descrição</th>
                                        <th>Tipo</th>
                                        <th>Última atualização</th>
                                        <th></th>
                                    </tr>
                                    <tr v-for="item in data.contas" class="page-table-row">
                                      <td><a href="" @click.prevent="openTransactions(item.id, item.description)">{{item.description}}</a></td>
                                      <td><span class="badge rounded-pill text-bg-primary" :style="`background:${item.accountType.color}!important`">{{ item.accountType.description }}</span></td>
                                      <td>{{item.updated_at}}</td>
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

import {onMounted, reactive, watch} from "vue";
import { useRouter } from "vue-router"
import PageTitle from "@/components/PageTitle";
import NoContent from "@/components/NoContent";
import Swal from 'sweetalert2'
import {deleteAccount, listAll} from "@/service/http/accountService";
import store from "@/store"
import {generatePagesArray} from "@/service/utils/Pagination";

export default {
    components: {PageTitle, NoContent},
    setup() {

      const router = useRouter();

      const data = reactive({
         contas : [],
         isOpenFilter: true,
         filters: {
            description: null
         },
         pagination : {
           pages: [],
           limit: 5,
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
          title: 'Confirmação',
          text: `Deseja deletar a conta ${descricaoConta} ?`,
          icon: 'question',
          showConfirmButton: true,
          confirmButtonText: "Sim",
          showCancelButton: true,
          cancelButtonText: "Não",
        }).then(result => {
             if(result.isConfirmed) {
                 deleteAccount(store.getters.userData.user_id,accountId, data)
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
        if(data.filters.description === null) {
           Swal.fire("Informe uma descrição para busca", '', 'error')
           return;
        }
        listAll(store.getters.userData.user_id, data.pagination.limit, data.pagination.current_page, data)
      }

      const openTransactions = (id, description) => {
        router.push({
          name:"conta-transaction",
          params: {id}
        })
      }

      onMounted(() => {
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
          openTransactions
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