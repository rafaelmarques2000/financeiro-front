const formatDateAndHour = (date) => {
    let dateObject = new Date(date)
    console.log(dateObject)
    let day = dateObject.getDate() < 10 ? "0" + dateObject.getDate() : dateObject.getDate()
    let month = dateObject.getMonth() < 10 ? "0" + dateObject.getMonth()+1 : dateObject.getMonth()+1
    let year = dateObject.getFullYear()

    let hour = dateObject.getHours() < 10 ? "0"+ dateObject.getHours() : dateObject.getHours()
    let minutes = dateObject.getMinutes() < 10 ? "0"+ dateObject.getMinutes() : dateObject.getMinutes()

    return day+"/"+month+"/"+year+" "+hour+":"+minutes
}

export {
    formatDateAndHour
}