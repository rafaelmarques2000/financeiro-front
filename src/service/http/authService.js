import HttpService from "@/service/http/HttpService";

const authenticate  = (data) => {
    return HttpService.post("/auth", {
        username: data.username,
        password: data.password
    })
}

const checkValidToken  = (token) => {
    return HttpService.post("/check-token", {token})
}

export {
    authenticate,
    checkValidToken
}