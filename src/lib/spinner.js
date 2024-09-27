// spinner.js
import Swal from 'sweetalert2';

export const showSpinner = () => {
  Swal.fire({
    title: 'Loading...',
    text: 'Please wait while we process your request.',
    allowEscapeKey: false,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
    willClose: () => {
      Swal.hideLoading();
    },
  });
};

export const hideSpinner = () => {
  Swal.close();
};
