const formatMoneyBRL = (value) => {
    return parseInt(value).toLocaleString("pt-BR", {style: "currency", currency :"BRL"})
}

const getMoneyValue = (value) => {
    if(Number.isInteger(value)) {
        return value * 100
    }else {
        let stringMoney = String(value).split(".")
        let decimal = parseInt(stringMoney[1])

        let money = String(value)
                            .replace(",", "")
                            .replace(".", "")
        if(decimal < 10) {
            money = money.concat('0')
        }
        return Number.parseInt(money)
    }
}

export {
    formatMoneyBRL,
    getMoneyValue
}