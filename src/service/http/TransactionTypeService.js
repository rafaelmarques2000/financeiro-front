import httpService from "@/service/http/HttpService";
import {showLoading} from "@/service/utils/alertsService";
import Swal from "sweetalert2";

const listTransactionType = (data) => {
    showLoading()
    return httpService.get('/transaction-types').then(result => {
        Swal.close()
        data.transactionTypes = result.data
    }).catch(error => {
        Swal.fire("Falha ao obter lista de tipos de transações", '', 'error')
    })
}

export {
    listTransactionType
}