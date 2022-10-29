import httpService from "@/service/http/HttpService";
import {showLoading} from "@/service/utils/alertsService";
import Swal from "sweetalert2";

const listAll = (userId, page, data) => {
    showLoading()
    return httpService.get(`/users/${userId}/accounts?limit=1&page=${page}`).then(result => {
        Swal.close()
        data.current_page = result.data.current_page
        data.totalPages = result.data.total_pages
        data.contas = result.data.items
    }).catch(error => {
        Swal.close()
        Swal.fire("Falha ao obter lista de contas", '', 'error')
    })
}

export {
    listAll
}