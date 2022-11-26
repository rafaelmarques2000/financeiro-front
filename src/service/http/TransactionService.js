import httpService from "@/service/http/HttpService";
import {showAlert, showLoading} from "@/service/utils/alertsService";
import Swal from "sweetalert2";
import {formatDate} from "@/service/utils/date";
import {getAccountPeriodStatistic} from "@/service/http/accountStatisticService";
import store from "@/store";

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
    let url = `/users/${userId}/accounts/${accountId}/transactions?limit=${data.pagination.limit}&page=${data.pagination.current_page}&initial_date=${formatDate(data.filters.range.start)}&end_date=${formatDate(data.filters.range.end)}`
    if(data.filters.description != null) {
        url = url.concat(`&description=${data.filters.description}`)
    }
    httpService.get(url).then(result => {
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
const getTransactionById = (userId, accountId,transactionId, data) => {
    httpService.get(`/users/${userId}/accounts/${accountId}/transactions/${transactionId}`).then(result => {
        Swal.close()
        data.transaction.description = result.data.description
        data.transaction.transaction_type = result.data.transaction_type.id
        data.transaction.transaction_category = result.data.category.id
        data.transaction.date = result.data.date.split("/").reverse().join("-")
        data.transaction.amount = result.data.amount
    }).catch(error => {
        Swal.close()
        showAlert("Falha ao obter dados da transacao", 'error');
    })
}


const deleteTransaction = (userId, accountId, transactionId, data) => {
    showLoading()
    return httpService.delete(`/users/${userId}/accounts/${accountId}/transactions/${transactionId}`).then(result => {
        Swal.close()
        getAccountTransactions(userId,accountId,data)
        getAccountPeriodStatistic(userId, accountId, data)
    }).catch(error => {
        Swal.close()
        showAlert('Falha ao deletar transação', 'error')
    })
}
const saveTransaction = (userId, accountId, data , router, clearForm) => {
    showLoading()
    let transaction = data.transaction
    if(transaction.installment === "false") {
        delete transaction['installment']
        delete transaction['amount_installments']
    }
    transaction.amount = parseInt(String(transaction.amount).replace(".", "").replace(",", ""))
    httpService.post(`/users/${userId}/accounts/${accountId}/transactions`, transaction).then(result => {
        showAlert(!clearForm ? "Transação cadastrada com sucesso!"
            : "Transação cadastrada com sucesso, Clique em OK para continuar",
            'success').then(result => {
            if(result.isConfirmed) {
                if(clearForm) {
                  data.transaction.description = null;
                  data.transaction.date = null;
                  data.transaction.transaction_type = "";
                  data.transaction.amount = null;
                  data.transaction.transaction_category = "";
                  data.categoryDisable = true
                  data.transaction.installment = "false";
                  data.transaction.amount_installments = null;
                  data.simulateInstallment = null
                  return
                }
                router.push({name: "conta-transaction", params: {id: accountId}})
            }
        })
    }).catch(error => {
        Swal.close()
        showAlert("Falha ao cadastrar transação!", 'error');
    })
}

const updateTransaction = (userId, accountId, transactionId, data , router) => {
    showLoading()
    let transaction = data.transaction
    delete transaction['installment']
    delete transaction['amount_installments']
    transaction.amount = parseInt(String(transaction.amount).replace(".", "").replace(",", ""))
    httpService.put(`/users/${userId}/accounts/${accountId}/transactions/${transactionId}`, transaction).then(result => {
        showAlert("Transação atualizada com sucesso!", 'success').then(result => {
            if(result.isConfirmed) {
                router.push({name: "conta-transaction", params: {id: accountId}})
            }
        })
    }).catch(error => {
        Swal.close()
        showAlert("Falha ao atualizar transação!", 'error');
    })
}


export {
    getAccountDetail,
    getAccountTransactions,
    getTransactionById,
    deleteTransaction,
    saveTransaction,
    updateTransaction
}