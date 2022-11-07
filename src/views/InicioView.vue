<template>
  <div class="inicio-view page-content">

           <div class="row">
                <div class="col-6">
                  <page-title style="border: none"
                      :title="'Bem vindo,' +data.user_show_name"
                      subtitle="Ajuste os filtros para obter resultados"
                  />
                  <div class="container cards-content-chart">
                      <div class="card chart-card">
                          <div class="card-body">
                              <bar
                                  :chart-data="data.chartData"
                                  :chart-options="data.chartOptions"
                              />
                          </div>
                      </div>
                  </div>
                </div>

             <div class="col-6">

               <div class="dropdown data-filter">
                 <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                   Hoje(27/10)
                 </button>
                 <ul class="dropdown-menu">
                   <li><button class="dropdown-item" type="button">Action</button></li>
                   <li><button class="dropdown-item" type="button">Another action</button></li>
                   <li><button class="dropdown-item" type="button">Something else here</button></li>
                 </ul>
               </div>

               <div class="container cards-content">
                 <div class="row metric-card-row">
                    <div class="col-md-6">
                        <div class="card metric-card metric-card-blue">
                            <div class="card-body">
                                 <h5 class="title-card">Total compras mês</h5>
                                 <span class="card-value">R$ 500,00</span>
                            </div>
                        </div>
                    </div>
                   <div class="col-md-6">
                     <div class="card metric-card metric-card-blue">
                       <div class="card-body">
                         <h5 class="title-card">Total compras mês</h5>
                         <span class="card-value">R$ 500,00</span>
                       </div>
                     </div>
                   </div>
                 </div>

                 <div class="row">
                   <div class="col-md-6">
                     <div class="card metric-card metric-card-blue">
                       <div class="card-body">
                         <h5 class="title-card">Total compras mês</h5>
                         <span class="card-value">R$ 500,00</span>
                       </div>
                     </div>
                   </div>

                   <div class="col-md-6">
                     <div class="card metric-card metric-card-blue">
                       <div class="card-body">
                         <h5 class="title-card">Total compras mês</h5>
                         <span class="card-value">R$ 500,00</span>
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

import { reactive } from "vue";
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import pageTitle from "@/components/PageTitle";
import store from "@/store";
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    components: {Bar, pageTitle},
    setup() {

      const data = reactive({
        chartData: {
          labels: [ 'January', 'February', 'March'],
          datasets: [
            {
              label: 'Faturas ao longo dos meses',
              backgroundColor: "#7DA0FA",
              data: [40, 20, 12]
            }
          ]
        },
        chartOptions: {
          responsive: true,
          maintainAspectRatio: false
        },
        user_show_name: store.getters.userData.show_name
      })


      return {
          data
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