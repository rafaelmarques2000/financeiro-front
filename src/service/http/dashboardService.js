import {hiddenLoading, showAlert, showLoading} from "@/service/utils/alertsService";
import httpService from "@/service/http/HttpService";
import Swal from "sweetalert2";
import {formatDate} from "@/service/utils/date";

const getExpencePerCategory = async (userId, data) => {
    try {
        showLoading()
        let url = `/users/${userId}/dashboard/expense-per-category?initial_date=${formatDate(data.filters.range.start)}&end_date=${formatDate(data.filters.range.end)}`
        let request = await httpService.get(url)
        hiddenLoading()
        return request;
    }catch (e) {
        Swal.close()
        showAlert("Falha ao obter dados do dashboard", 'error');
    }
}

export {
    getExpencePerCategory
}