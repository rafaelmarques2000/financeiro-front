<template>
    <div class="conta-form-view page-content">
            <page-title
                :title="data.pageTitle"
                page-icon="fa-solid fa-receipt"
                :subtitle="data.subtitle"
            ></page-title>
            <div class="row">
                 <div class="col-12">
                      <div class="card form-page-card">
                           <div class="card-body page-card-body">
                                <form>
                                  <div class="mb-3">
                                    <label for="description" class="form-label">Descrição</label>
                                    <input type="text" v-model="data.account.description" class="form-control" id="description" placeholder="Digite um nome para sua conta" aria-describedby="descriptionHelp">
                                  </div>

                                  <div class="mb-3">
                                    <label for="accounttype" class="form-label">Tipo de conta</label>
                                    <select class="form-select" v-model="data.account.accountTypeId" aria-label="Default select example">
                                      <option selected>Selecione um tipo de conta</option>
                                      <option value="1">One</option>
                                      <option value="2">Two</option>
                                      <option value="3">Three</option>
                                    </select>
                                  </div>
                                  <div class="mb-3">
                                      <button style="margin-right: 10px" @click="submit" class="btn btn-primary btn-primary-custom">Concluir</button>
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

import {onMounted, reactive} from "vue";
import PageTitle from "@/components/PageTitle";
import { useRoute, useRouter } from 'vue-router'
import Swal from "sweetalert2";

export default {
    components: {PageTitle},
    setup() {

      const router = useRouter();
      const route = useRoute();

      const data = reactive({
          pageTitle: "",
          subtitle: "",
          account: {
             description: "",
             accountTypeId: ""
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

        if(!data.account.accountTypeId) {
          Swal.fire("Atenção", "Selecione um tipo de conta", "warning", "")
          return
        }

        Swal.fire({
          title:"",
          text:"Processando aguarde....",
          icon: "",
          buttons: false,
          closeOnClickOutside: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false
        });


        window.setTimeout(() => {
          Swal.fire("Conta cadastra com sucesso.", "", "success", "")
          router.push({name: "contas"})
        },3000)

      }

      onMounted(() => {
          if(route.params.id != null) {
             data.pageTitle = "Editar Conta"
             data.subtitle = "Edite sua conta"
             return
          }
          data.pageTitle = "Nova Conta"
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