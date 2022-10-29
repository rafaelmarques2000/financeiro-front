import Swal from "sweetalert2";

const showLoading = () => {
        Swal.fire({
            title:"",
            text:"Processando aguarde....",
            icon: "",
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false
        });
}

export  {
    showLoading
}