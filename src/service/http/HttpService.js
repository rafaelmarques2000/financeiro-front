import axios from "axios";
import store from "../../store/index"

let axiosOption = {
    baseURL:"http://localhost/api/v1",
    headers: {}
}

if(store.getters.isAuth) {
    axiosOption.headers = {
        "Authorization" : `bearer ${store.getters.userData.token}`
    }
}

export default axios.create(axiosOption)