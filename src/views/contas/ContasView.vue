<template>
    <div class="contas-view page-content">
            <page-title
                title="Contas"
                page-icon="fa-solid fa-receipt"
                subtitle="Gerencie suas contas"
            ></page-title>
            <div class="row">
                 <div class="col-12">
                      <div class="card page-card">
                        <div class="page-action">
                          <button class="btn btn-primary btn-primary-custom" type="button" @click="openForm(null)"><font-awesome-icon icon="fa-solid fa-circle-plus" /></button>
                          <button class="btn btn-secondary" type="button"><font-awesome-icon icon="fa-solid fa-filter" /></button>
                        </div>
                           <div class="card-body page-card-body">
                                <no-content message="Ainda não há contas cadastradas, clique adicionar para cria sua primeira conta" v-if="!data.contas.length"></no-content>
                                <table class="table table-hover" v-if="data.contas.length">
                                    <tr class="page-table-header">
                                        <th>Descrição</th>
                                        <th>Tipo</th>
                                        <th>Data Criação</th>
                                        <th>Ações</th>
                                    </tr>
                                    <tr v-for="item in data.contas" class="page-table-row">
                                      <td>{{item.description}}</td>
                                      <td><span class="badge rounded-pill text-bg-primary">{{ item.accountType.description }}</span></td>
                                      <td>{{item.created_at}}</td>
                                      <td>
                                         <div class="row-btn-actions">
                                              <button type="button" @click="openForm(item.id)" class="btn btn-primary btn-primary-custom"><font-awesome-icon icon="fa-solid fa-pen-to-square" /></button>
                                              <button type="button" @click="deletePrompt(item.description)" class="btn btn-outline-danger"><font-awesome-icon icon="fa-solid fa-trash" /></button>
                                         </div>
                                      </td>
                                    </tr>
                                </table>
                           </div>
                      </div>
                 </div>
            </div>
           <div class="row">
               <div class="col-12">
                 <nav aria-label="Page navigation example">
                   <ul class="pagination">
                     <li class="page-item"><a @click.prevent="navigatePages('prev')" class="page-link" href="#">Anterior</a></li>
                     <li class="page-item"><a @click.prevent="navigatePages('next')" class="page-link" href="#">Proximo</a></li>
                   </ul>
                 </nav>
               </div>
           </div>
    </div>
</template>

<script>

import {onMounted, reactive} from "vue";
import { useRouter } from "vue-router"
import PageTitle from "@/components/PageTitle";
import NoContent from "@/components/NoContent";
import Swal from 'sweetalert2'
import HttpService from "@/service/http/HttpService";
import {showLoading} from "@/service/utils/alertsService";
import {listAll} from "@/service/http/accountService";
import store from "@/store"



export default {
    components: {PageTitle, NoContent},
    setup() {

      const router = useRouter();

      const data = reactive({
         contas : [],
         current_page:1,
         totalPages: 0
      })

      let openForm = (id) => {
         if(id != null) {
           router.push({name: "contas-form-edit", params:{id}})
           return
         }
         router.push({name: "contas-form"})
      }

      let deletePrompt = (descricaoConta) => {
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
                 Swal.fire("Confirmado o delete", "", "success")
             }
        })
      }

      const navigatePages = (direction) =>{
          if(direction === 'prev') {
            if(data.current_page < data.totalPages) {
               return
            }
            data.current_page -=1
            listAll(store.getters.userData.user_id, data.current_page, data)
            return;
          }

          if(direction === 'next') {
            console.log(data.current_page, data.totalPages)
            if(data.current_page >= data.totalPages) {
              return
            }
            data.current_page +=1
            listAll(store.getters.userData.user_id, data.current_page, data)
          }
      }

      onMounted(() => {
          listAll(store.getters.userData.user_id, data.current_page, data)
      })


      return {
          data,
          openForm,
          deletePrompt,
         navigatePages
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