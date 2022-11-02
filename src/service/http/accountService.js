import httpService from "@/service/http/HttpService";
import {showAlert, showLoading} from "@/service/utils/alertsService";
import Swal from "sweetalert2";

const listAll = (userId, limit, page, data) => {
    showLoading()
    let url = `/users/${userId}/accounts?limit=${limit}&page=${page}`

    if(data.filters.description != null) {
       url = url.concat(`&description=${data.filters.description}`)
    }
    httpService.get(url).then(result => {
        Swal.close()
        data.pagination.current_page = result.data.current_page
        data.pagination.totalPages = result.data.total_pages
        data.pagination.totalRows = result.data.total_rows
        data.contas = result.data.items
    }).catch(error => {
        Swal.close()
        showAlert("Falha ao obter lista de contas", 'error');
    })
}

const getAccountById = (userId, accountId, data) => {
    httpService.get(`/users/${userId}/accounts/${accountId}`).then(result => {
      Swal.close()
      data.account.description = result.data.description
      data.account.account_type_id = result.data.accountType.id
    }).catch(error => {
        Swal.close()
        showAlert("Falha ao obter dados da conta", 'error');
    })
}

const saveAccount = (userId, data , router) => {
    showLoading()
    httpService.post(`/users/${userId}/accounts`, data.account).then(result => {
        showAlert("Conta cadastrada com sucesso!", 'success').then(result => {
             if(result.isConfirmed) {
                 router.push({name: "contas"})
             }
        })
    }).catch(error => {
        Swal.close()
        showAlert("Conta cadastrada com sucesso!", 'error');
    })
}

const updateAccount = (userId,accountId,router,data) => {
    showLoading()
    httpService.put(`/users/${userId}/accounts/${accountId}`, data.account).then(result => {
        showAlert("Conta atualizada com sucesso", 'success').then(result => {
            if(result.isConfirmed) {
                router.push({name: "contas"})
            }
        })
    }).catch(error => {
        Swal.close()
        showAlert("Falha ao atualizar conta", 'error');
    })
}

const deleteAccount = (userId, accountId, data) => {
    showLoading()
    return httpService.delete(`/users/${userId}/accounts/${accountId}`).then(result => {
        Swal.close()
        listAll(userId, data.pagination.limit, data.pagination.current_page, data)
    }).catch(error => {
        console.log(error)
        Swal.close()
        showAlert('Falha ao deletar conta', 'error')
    })
}

export {
    saveAccount,
    updateAccount,
    deleteAccount,
    getAccountById,
    listAll
}