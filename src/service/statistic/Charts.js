import bb, {pie} from "billboard.js";
import {getExpencePerCategory} from "@/service/http/dashboardService";
import store from "@/store";

const generateChartExpensePerCategory = async (data) => {

    let chartData = []
    let expenses = await getExpencePerCategory(store.getters.userData.user_id, data)

    data.dashboard.expensePerCategoryData = expenses.data

    for (let i=0;i<expenses.data.length ;i++) {
        chartData.push([expenses.data[i].description, expenses.data[i].amount])
    }

    let options = {
        data: {
            columns: chartData,
            type: pie(), // for ESM specify as: bar()
        },
        pie: {
            width: {
                ratio: 0.3
            }
        },
        tooltip: {
            init: {
                show: true
            },
            doNotHide: false,
            contents: {
                template: "<ul>{{<li class={=CLASS_TOOLTIP_NAME}><span>{=VALUE}</span><br><span style=color:{=COLOR}>{=NAME}</span></li>}}<li>{=TITLE}</li></ul>"
            }
        },
        legend: {
            show: true,
            position: "right"
        },
        bindto: "#bar-chart"
    }
    let chart = bb.generate(options);
    if(expenses.data.length !== 0) {
        chart.resize({width: 600, height:350})
        data.dashboard.expensePerCategoryColors = chart.data.colors()
        console.log('show')
        return chart
    }else {
        data.dashboard.expensePerCategoryData = null
        data.dashboard.expensePerCategoryColors = null
        chart.destroy()
        console.log('aqui')
    }
}

export {
    generateChartExpensePerCategory
}