import httpService from "@/service/http/HttpService";
import {showLoading} from "@/service/utils/alertsService";
import Swal from "sweetalert2";

const listAccountTypes = (data) => {
    return httpService.get('/account-types').then(result => {
        data.accountTypes = result.data
    }).catch(error => {
        Swal.fire("Falha ao obter lista de tipos de contas", '', 'error')
    })
}

export {
    listAccountTypes
}