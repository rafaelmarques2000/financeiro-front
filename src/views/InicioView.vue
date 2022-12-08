<template>
  <div class="inicio-view page-content">

          <div class="row" style="margin-bottom: 32px">
              <div class="col-12">
                <page-title  style="border: none; padding: 0"
                            :title="'Bem vindo, ' +data.user_show_name+'!'"
                            subtitle="Acompanhe aqui a evolução das suas finanças."
                />
              </div>
          </div>


    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#anual" type="button" role="tab" aria-controls="home" aria-selected="true">Graficos Anuais</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#mensal" type="button" role="tab" aria-controls="profile" aria-selected="false">Graficos Mensais</button>
      </li>
    </ul>
    <div class="tab-content" id="tabdash">
      <div class="tab-pane fade show active" id="anual" role="tabpanel" aria-labelledby="home-tab">
        <div class="row">
           <div class="col-12 home-filter">
                <select class="form-select" v-model="data.filters.competenceYear" style="width: 120px">
                    <option v-for="item in data.competenceList">{{item}}</option>
                </select>
               <button type="button" @click="searchFilterYear" style="margin-left: 13px; height: 36px;" class="btn btn-primary btn-primary-custom">
                 <font-awesome-icon icon="fa-solid fa-search"></font-awesome-icon>
               </button>
           </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="card cards-content-chart">
              <h1 class="chart-content-title">Total Anual de gastos</h1>
              <no-content message="Não há dados no período" style="position: relative; top: 45%; bottom: 10px" v-if="data.dashboard.invoiceYearsData == null"></no-content>
              <div id="barChart_1"></div>
              <div id="chart-bar-legend"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="tab-pane fade" id="mensal" role="tabpanel" aria-labelledby="profile-tab">
        <div class="row">
           <div class="col-12 home-filter">
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
                   <input disabled
                          class="form-control"
                          :value="inputValue.end"
                          v-on="inputEvents.end"
                   />
                 </div>
               </template>
             </v-date-picker>
             <button type="button" @click="searchFilter" style="margin-left: 13px; height: 36px;" class="btn btn-primary btn-primary-custom">
               <font-awesome-icon icon="fa-solid fa-search"></font-awesome-icon>
             </button>
           </div>
        <div>
        <div class="row">
          <div class="col-6">
            <div class="card cards-content-chart">
              <h1 class="chart-content-title">Gastos por categoria</h1>
              <div class="chart-pie-content" style="justify-content: center; min-height: 300px; margin-bottom: 30px">
                <no-content message="Não há dados no período" style="position: relative; top: 50%" v-if="data.dashboard.expensePerCategoryData == null"></no-content>
                <div id="bar-chart"></div>
                <div id="chart-pie-legend"></div>
              </div>
            </div>
          </div>

          <div class="col-6">
            <div class="card cards-content-chart ranking-category">
              <h1 class="chart-content-title">Ranking de gastos</h1>
              <div class="chart-pie-content" style="padding-left: 64px;">
                <div class="details-pie-content">
                  <no-content message="Não há dados no período" style="position: relative; top: 50%" v-if="data.dashboard.expensePerCategoryData == null"></no-content>
                  <div v-else v-for="item in data.dashboard.expensePerCategoryData" class="categories-progress">
                    <h4>{{item.description}} - {{ formatMoneyBRL(item.amount) }}</h4>
                    <div class="progress" style="height: 20px;">
                      <div class="progress-bar bar-animate" role="progressbar" :style="`width: ${item.percentage}%; background:${data.dashboard.expensePerCategoryColors[item.description]}`" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
  </div>
  </div>
</template>

<script>

import {onMounted, reactive} from "vue";
import pageTitle from "@/components/PageTitle";
import store from "@/store";
import {generateBarInvoiceReport, generateChartExpensePerCategory} from "@/service/statistic/Charts";
import {formatMoneyBRL} from "@/service/utils/helpers";
import NoContent from "@/components/NoContent";
import {generateYears} from "@/service/utils/date";

export default {
    components: {NoContent, pageTitle},
    setup() {
      const data = reactive({
        user_show_name: store.getters.userData.show_name,
        competenceList: [],
        filters: {
           initialDate: "",
           endDate: "",
           range: null,
           competenceYear: null
        },
        dashboard: {
          expensePerCategoryData: null,
          invoiceYearsData: null,
          expensePerCategoryColors: []
        }
      })

      const searchFilter = () => {
         generateChartExpensePerCategory(data)
      }

      const searchFilterYear = () => {
        generateBarInvoiceReport(data)
      }

      onMounted(() => {
        data.competenceList = generateYears(2022)
        const now = new Date()
        data.filters.competenceYear = now.getFullYear()
        data.filters.range = {
            start: new Date(now.getFullYear(), now.getMonth(), 1),
            end: new Date(now.getFullYear(), now.getMonth() + 1, 0)
        }
        generateChartExpensePerCategory(data)
        generateBarInvoiceReport(data)

      })

      return {
          data,
          searchFilter,
          searchFilterYear,
          formatMoneyBRL
      }
    }
 }

</script>

<style scoped>
   .inicio-view {
      width: 100%;
      height: calc(100vh - 60px);
   }
   .cards-content-chart {
     margin-top: 30px;
   }
</style>