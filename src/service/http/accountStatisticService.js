import {showAlert, showLoading} from "@/service/utils/alertsService";
import {formatDate} from "@/service/utils/date";
import httpService from "@/service/http/HttpService";
import Swal from "sweetalert2";

const getAccountPeriodGeneralStatistic = (userId , data , isCreditCard) => {
    showLoading()
    let url = `/users/${userId}/accounts/statistics`
    url = url.concat(`?initial_date=${formatDate(data.filters.range.start)}&end_date=${formatDate(data.filters.range.end)}`)

    if(isCreditCard) {
        url = url.concat(`&account_types[]=cartao_credito`)
    }

    if(!isCreditCard) {
        url = url.concat(`&account_types[]=conta_corrente`)
        url = url.concat(`&account_types[]=poupanca_reserva`)
        url = url.concat(`&account_types[]=investimento`)
    }

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