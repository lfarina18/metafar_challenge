import { useCallback, useEffect, useState } from "react";
import {
  dismissToast,
  showLoadingToast,
  showSuccessToast,
} from "../../utils/toast";

interface UseHistoricalChartToastParams {
  enabled: boolean;
  isError: boolean;
  isSuccess: boolean;
}

export const useHistoricalChartToast = ({
  enabled,
  isError,
  isSuccess,
}: UseHistoricalChartToastParams) => {
  const [toastId, setToastId] = useState<string | null>(null);

  const show = useCallback(() => {
    const id = showLoadingToast("Cargando gráfico...");
    setToastId(id);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    if (!toastId) return;

    if (isError) {
      dismissToast(toastId);
      setToastId(null);
      return;
    }

    if (isSuccess) {
      dismissToast(toastId);
      setToastId(null);
      showSuccessToast("Gráfico actualizado");
    }
  }, [enabled, isError, isSuccess, toastId]);

  return {
    show,
    toastId,
  };
};
