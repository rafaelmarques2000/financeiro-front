import httpService from "@/service/http/HttpService";
import {showAlert, showLoading} from "@/service/utils/alertsService";
import Swal from "sweetalert2";
import {listAll} from "@/service/http/accountService";


const getAccountDetail = (userId, accountId, data) => {
    showLoading()
    httpService.get(`/users/${userId}/accounts/${accountId}`).then(result => {
      Swal.close()
      data.accountDetails.description = result.data.description
      data.accountDetails.type = result.data.accountType.description
    }).catch(error => {
        Swal.close()
        showAlert("Falha ao obter dados da conta", 'error');
    })
}

const getAccountTransactions = (userId, accountId, data) => {
    showLoading()
    httpService.get(`/users/${userId}/accounts/${accountId}/transactions?limit=${data.pagination.limit}&page=${data.pagination.current_page}&initial_date=${data.filters.firstDayMonth}&end_date=${data.filters.lastDayMonth}`).then(result => {
        Swal.close()
        data.pagination.current_page = result.data.current_page
        data.pagination.totalPages = result.data.total_pages
        data.pagination.totalRows = result.data.total_rows
        data.transactions = result.data.items
    }).catch(error => {
        Swal.close()
        showAlert("Falha ao obter transações", 'error');
    })
}

const deleteTransaction = (userId, accountId, transactionId, data) => {
    showLoading()
    return httpService.delete(`/users/${userId}/accounts/${accountId}/transactions/${transactionId}`).then(result => {
        Swal.close()
        getAccountTransactions(userId,accountId,data)
    }).catch(error => {
        Swal.close()
        showAlert('Falha ao deletar transação', 'error')
    })
}

export {
    getAccountDetail,
    getAccountTransactions,
    deleteTransaction
}