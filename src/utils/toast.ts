import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { ApiError } from "../services/shared/validateResponse";

export const isNoDataError = (error: unknown): boolean => {
  if (error instanceof ApiError) {
    const raw = error.rawMessage ?? "";
    if (/no\s+data/i.test(raw)) return true;
    if (error.code === 404) return true;
  }

  if (isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 404) return true;
  }

  return false;
};

export const getPublicErrorMessage = (error: unknown): string => {
  const statusFromAxios = isAxiosError(error)
    ? error.response?.status
    : undefined;

  const statusFromApiError = error instanceof ApiError ? error.code : undefined;
  const status = statusFromAxios ?? statusFromApiError;

  if (!status) {
    return "Ocurrió un error inesperado. Por favor, recarga la página.";
  }

  if (status >= 500) {
    return "El servicio está teniendo problemas en este momento. Probá de nuevo más tarde.";
  }

  switch (status) {
    case 400:
      return "No se pudo procesar la solicitud con los datos ingresados. Probá con otra fecha u otro intervalo.";
    case 401:
      return "No se pudo validar el acceso al servicio. Revisá la configuración e intentá nuevamente.";
    case 403:
      return "Tu cuenta no tiene permisos para acceder a esta información.";
    case 404:
      return "No se encontró información para tu búsqueda.";
    case 414:
      return "El dato ingresado es demasiado largo. Acortalo e intentá nuevamente.";
    case 429:
      return "Se realizaron demasiadas solicitudes en poco tiempo. Esperá unos segundos y volvé a intentar.";
    default:
      return "Ocurrió un error al procesar la solicitud. Por favor, intentá nuevamente.";
  }
};

export const showSuccessToast = (message: string) => {
  toast.success(message);
};

export const showErrorToast = (message: string) => {
  toast.error(message);
};

export const showInfoToast = (message: string) => {
  toast(message, {
    icon: "ℹ️",
  });
};

export const showLoadingToast = (message: string) => {
  return toast.loading(message);
};

export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};
