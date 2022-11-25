import httpService from "@/service/http/HttpService";
import {showAlert, showLoading} from "@/service/utils/alertsService";
import Swal from "sweetalert2";
import {formatDate} from "@/service/utils/date";

const listAll = (userId, limit, page, data) => {
    showLoading()
    let url = `/users/${userId}/accounts?limit=${limit}&page=${page}`

    if(data.filters.description != null) {
       url = url.concat(`&description=${data.filters.description}`)
    }

    if(data.listFilter.isCreditCard) {
        url = url.concat(`&account_types[]=cartao_credito`)
    }

    if(data.listFilter.isConta) {
        url = url.concat(`&account_types[]=conta_corrente`)
    }

    if(data.listFilter.isReserva) {
        url = url.concat(`&account_types[]=poupanca_reserva`)
        url = url.concat(`&account_types[]=investimento`)
    }

    url = url.concat(`&initial_date=${formatDate(data.filters.range.start)}&end_date=${formatDate(data.filters.range.end)}`)

    httpService.get(url).then(result => {
        Swal.close()
        data.pagination.current_page = result.data.current_page
        data.pagination.totalPages = result.data.total_pages
        data.pagination.totalRows = result.data.total_rows
        data.contas = result.data.items
    }).catch(error => {
        Swal.close()
        showAlert("Falha ao obter lista de dados", 'error');
    })
}

const getAccountById = (userId, accountId, data) => {
    httpService.get(`/users/${userId}/accounts/${accountId}`).then(result => {
      Swal.close()
      data.account.description = result.data.description
      data.account.account_type_id = result.data.accountType.id
    }).catch(error => {
        Swal.close()
        showAlert("Falha ao obter dados", 'error');
    })
}

const saveAccount = (userId, data , router, redirectName) => {
    showLoading()
    httpService.post(`/users/${userId}/accounts`, data.account).then(result => {
        showAlert("Cadastro Realizado com sucesso!", 'success').then(result => {
             if(result.isConfirmed) {
                 router.push({name: redirectName})
             }
        })
    }).catch(error => {
        Swal.close()
        showAlert("Falha ao realizar cadastro", 'error');
    })
}

const updateAccount = (userId,accountId,router,data , redirectName) => {
    showLoading()
    httpService.put(`/users/${userId}/accounts/${accountId}`, data.account).then(result => {
        showAlert("Atualização realizada com sucesso!", 'success').then(result => {
            if(result.isConfirmed) {
                router.push({name: redirectName})
            }
        })
    }).catch(error => {
        Swal.close()
        showAlert("Falha ao realizar atualização", 'error');
    })
}

const deleteAccount = (userId, accountId, data , isCreditCard) => {
    showLoading()
    return httpService.delete(`/users/${userId}/accounts/${accountId}`).then(result => {
        Swal.close()
        listAll(userId, data.pagination.limit, data.pagination.current_page, data , isCreditCard)
    }).catch(error => {
        console.log(error)
        Swal.close()
        showAlert('Falha ao deletar registro', 'error')
    })
}

export {
    saveAccount,
    updateAccount,
    deleteAccount,
    getAccountById,
    listAll
}