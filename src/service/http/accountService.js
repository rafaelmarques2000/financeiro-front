import httpService from "@/service/http/HttpService";
import {showLoading} from "@/service/utils/alertsService";
import Swal from "sweetalert2";
import {generatePagesArray} from "@/service/utils/Pagination";

const listAll = (userId, limit, page, data) => {
    showLoading()
    httpService.get(`/users/${userId}/accounts?limit=${limit}&page=${page}`).then(result => {
        Swal.close()
        data.pagination.current_page = result.data.current_page
        data.pagination.totalPages = result.data.total_pages
        data.contas = result.data.items
        data.pagination.pages = generatePagesArray(data.pagination.current_page, result.data.total_rows, data.pagination.limit, 12)
    }).catch(error => {
        Swal.close()
        Swal.fire("Falha ao obter lista de contas", '', 'error')
    })
}

const getAccountById = (userId, accountId, data) => {
    showLoading()
    httpService.get(`/users/${userId}/accounts/${accountId}`).then(result => {
      Swal.close()
      data.account.description = result.data.description
      data.account.account_type_id = result.data.accountType.id
    }).catch(error => {
        Swal.close()
        Swal.fire("Falha ao obter dados da conta", '', 'error')
    })
}

const saveAccount = (userId, data , router) => {
    showLoading()
    httpService.post(`/users/${userId}/accounts`, data.account).then(result => {
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

const updateAccount = (userId,accountId,router,data) => {
    showLoading()
    httpService.put(`/users/${userId}/accounts/${accountId}`, data.account).then(result => {
        Swal.close()
        Swal.fire("Conta atualizada com sucesso", '', 'success').then(result => {
            if(result.isConfirmed) {
                router.push({name: "contas"})
            }
        })
    }).catch(error => {
        Swal.close()
        Swal.fire("Falha ao atualizar conta", '', 'error')
    })
}

const deleteAccount = (userId, accountId, data) => {
    showLoading()
    return httpService.delete(`/users/${userId}/accounts/${accountId}`).then(result => {
        Swal.close()
        Swal.fire("Conta deletada com sucesso", '', 'success')
        listAll(userId, data.pagination.limit, data.pagination.current_page, data)
    }).catch(error => {
        console.log(error)
        Swal.close()
        Swal.fire("Falha ao deletar conta", '', 'error')
    })
}

export {
    saveAccount,
    updateAccount,
    deleteAccount,
    getAccountById,
    listAll
}