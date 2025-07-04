import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showSuccess = (mensagem) => {
  toast.success(mensagem);
};

export const showError = (mensagem) => {
  toast.error(mensagem);
};

export const showInfo = (mensagem) => {
  toast.info(mensagem);
};

export const showWarn = (mensagem) => {
  toast.warn(mensagem);
};

export  const Toast = () => (
  <ToastContainer
    position="top-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    pauseOnHover
    draggable
  />
);