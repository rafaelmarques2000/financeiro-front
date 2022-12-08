import bb, {bar, pie} from "billboard.js";
import {getExpencePerCategory, getInvoiceReport} from "@/service/http/dashboardService";
import store from "@/store";
import {formatMoneyBRL} from "@/service/utils/helpers";

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
                ratio: 0.8
            }
        },
        tooltip: {
            contents: {
                template: "<ul>{{<li class={=CLASS_TOOLTIP_NAME}><span>{=VALUE}</span><br><span style=color:{=COLOR}>{=NAME}</span></li>}}<li>{=TITLE}</li></ul>"
            }
        },
        legend: {
            contents: {
                bindto: "#chart-pie-legend",
                template: function (title, color) {
                    return "<span style='background-color:" + color + ";padding:5px'>" + title + "</span>";
                }
            }
        },
        bindto: "#bar-chart"
    }
    let chart = bb.generate(options);
    if(expenses.data.length !== 0) {
        chart.resize({width: 600, height:350})
        data.dashboard.expensePerCategoryColors = chart.data.colors()
        return chart
    }else {
        data.dashboard.expensePerCategoryData = null
        data.dashboard.expensePerCategoryColors = null
        chart.destroy()
    }
}

const generateBarInvoiceReport = async (data) => {
    let chartData = []
    let invoices = await getInvoiceReport(store.getters.userData.user_id, data)
    data.dashboard.invoiceYearsData = invoices.data
    let formatObject = {}
    for (let i=0;i<invoices.data.length ;i++) {
        chartData.push([invoices.data[i].month, invoices.data[i].amount])
        formatObject[invoices.data[i].month] = function (x) { return formatMoneyBRL(x)}
    }

    let chartOptions = {
        data: {
            columns: chartData,
            type: bar(),
            labels: {
                format: formatObject
            }
        },
        axis: {
          x: {
             tick: {
                 show: false,
                 culling: false,
                 format: function (x) {}
             }
          }
        },
        tooltip: {
            show: false
        },
        legend: {
            contents: {
                bindto: "#chart-bar-legend",
                template: function (title, color) {
                    return "<span style='background-color:" + color + ";padding:5px'>" + title + "</span>";
                }
            }
        },
        bar: {
            padding: 20,
            width: {
                ratio: 0.9,
                max: 100
            }
        },
        bindto: "#barChart_1"
    }



    let chart = bb.generate(chartOptions);
    if(invoices.data.length === 0) {
        data.dashboard.invoiceYearsData = null
        chart.destroy()
    }
}

export {
    generateChartExpensePerCategory,
    generateBarInvoiceReport
}