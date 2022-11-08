import httpService from "@/service/http/HttpService";
import {showLoading} from "@/service/utils/alertsService";
import Swal from "sweetalert2";

const listTransactionCategories = (data) => {
    showLoading()
    return httpService.get(`/transaction-categories?transaction_type_id=${data.transaction.transaction_type}`).then(result => {
        Swal.close()
        data.transactionCategories = result.data
    }).catch(error => {
        Swal.fire("Falha ao obter lista de categorias", '', 'error')
    })
}

export {
    listTransactionCategories
}