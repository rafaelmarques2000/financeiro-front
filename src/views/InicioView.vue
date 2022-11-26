<template>
  <div class="inicio-view page-content">

          <div class="row">
              <div class="col-6">
                <page-title style="border: none"
                            :title="'Bem vindo, ' +data.user_show_name+'!'"
                            subtitle="Acompanhe aqui a evolução das suas finanças."
                />
              </div>
              <div class="col-6 home-filter" >
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
          </div>

          <div class="row">
              <div class="col-12">
                  <div class="card cards-content-chart">
                      <h1 class="chart-content-title">Total de gastos</h1>
                      <div id="barChart_1"></div>
                  </div>
              </div>
          </div>

           <div class="row">
                <div class="col-6">
                  <div class="card cards-content-chart">
                      <h1 class="chart-content-title">Gastos por categoria</h1>
                      <div class="chart-pie-content" style="justify-content: center; min-height: 300px; margin-bottom: 30px">
                        <no-content message="Não há dados no período" style="position: relative; top: 50%" v-if="data.dashboard.expensePerCategoryData == null"></no-content>
                        <div id="bar-chart"></div>
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
</template>

<script>

import {onMounted, reactive} from "vue";
import pageTitle from "@/components/PageTitle";
import store from "@/store";
import {generateBarInvoiceReport, generateChartExpensePerCategory} from "@/service/statistic/Charts";
import {formatMoneyBRL} from "@/service/utils/helpers";
import NoContent from "@/components/NoContent";

export default {
    components: {NoContent, pageTitle},
    setup() {
      const data = reactive({
        user_show_name: store.getters.userData.show_name,
        filters: {
           initialDate: "",
           endDate: "",
           range: null
        },
        dashboard: {
          expensePerCategoryData: null,
          expensePerCategoryColors: []
        }
      })

      const searchFilter = () => {
         let chart = generateChartExpensePerCategory(data)
      }

      onMounted(() => {
        const now = new Date();
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

   .metric-card {
      height: 130px;
      border: none;
      border-radius: 15px;
      color:#fff;
   }

   .metric-card-blue {
      background: #7DA0FA;
   }

   .metric-card-row {
     margin-bottom: 30px;
   }

   .title-card {
     margin-top: 10px;
     margin-bottom: 20px;
     font-weight: 400;
     font-family: 'Roboto', sans-serif;
   }

   .card-value {
      font-size: 2em;
      font-family: 'Roboto', sans-serif;
   }

   .data-filter {
      display: flex;
      justify-content: flex-end;
      padding-right: 15px;
   }

   .cards-content {
       margin-top: 50px;
   }

   .cards-content-chart {
     margin-top: 30px;
   }

   .chart-card {
      border: none;
   }

</style>