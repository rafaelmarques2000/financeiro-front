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
        legend: {
            show: true,
            position: "right"
        },
        bindto: "#bar-chart"
    }

    if(expenses.data.length !== 0) {
        let chart = bb.generate(options);
        chart.resize({width: 600, height:350})
        data.dashboard.expensePerCategoryColors = chart.data.colors()
        return chart
    }else {
        data.dashboard.expensePerCategoryData = null
        data.dashboard.expensePerCategoryColors = null
    }
}

export {
    generateChartExpensePerCategory
}