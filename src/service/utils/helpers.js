const formatMoneyBRL = (value) => {
    return parseInt(value).toLocaleString("pt-BR", {style: "currency", currency :"BRL"})
}

export {
    formatMoneyBRL
}