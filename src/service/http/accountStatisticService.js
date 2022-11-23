import {showAlert, showLoading} from "@/service/utils/alertsService";
import {formatDate} from "@/service/utils/date";
import httpService from "@/service/http/HttpService";
import Swal from "sweetalert2";

const getAccountPeriodGeneralStatistic = (userId , data) => {
    showLoading()
    let url = `/users/${userId}/accounts/statistics`
    url = url.concat(`?initial_date=${formatDate(data.filters.range.start)}&end_date=${formatDate(data.filters.range.end)}`)

    httpService.get(url).then(result => {
        Swal.close()
        console.log(result.data)
        data.statistics = result.data
    }).catch(error => {
        Swal.close()
        showAlert("Falha ao obter estatística  da conta", 'error');
    })
}

const getAccountPeriodStatistic = (userId ,accountId, data) => {
    showLoading()
    let url = `/users/${userId}/accounts/${accountId}/statistics`
    url = url.concat(`?initial_date=${formatDate(data.filters.range.start)}&end_date=${formatDate(data.filters.range.end)}`)

    httpService.get(url).then(result => {
        Swal.close()
        data.statistics = result.data
    }).catch(error => {
        Swal.close()
        showAlert("Falha ao obter estatística  da conta", 'error');
    })
}

export  {
    getAccountPeriodGeneralStatistic,
    getAccountPeriodStatistic
}