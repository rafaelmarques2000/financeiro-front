import httpService from "@/service/http/HttpService";
import {showLoading} from "@/service/utils/alertsService";
import Swal from "sweetalert2";

const listAll = (userId, limit, page, data) => {
    showLoading()
    return httpService.get(`/users/${userId}/accounts?limit=${limit}&page=${page}`).then(result => {
        Swal.close()
        data.current_page = result.data.current_page
        data.totalPages = result.data.total_pages
        data.contas = result.data.items
    }).catch(error => {
        Swal.close()
        Swal.fire("Falha ao obter lista de contas", '', 'error')
    })
}

const saveAccount = (userId, data , router) => {
    showLoading()
    return httpService.post(`/users/${userId}/accounts`, data.account).then(result => {
        Swal.close()
        Swal.fire("Conta cadastrada com sucesso", '', 'success').then(result => {
             if(result.isConfirmed) {
                 router.push({name: "contas"})
             }
        })
    }).catch(error => {
        Swal.close()
        Swal.fire("Falha ao cadastrar conta", '', 'error')
    })
}

export {
    saveAccount,
    listAll
}