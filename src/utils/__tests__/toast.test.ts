import { describe, expect, it, vi } from "vitest";
import { ApiError } from "../../services/shared/validateResponse";

const toastFn = vi.fn();
const toastSuccessMock = vi.fn();
const toastErrorMock = vi.fn();
const toastLoadingMock = vi.fn(() => "toast-id");
const toastDismissMock = vi.fn();

const isAxiosErrorMock = vi.fn();

vi.mock("react-hot-toast", () => ({
  default: Object.assign(toastFn, {
    success: (...args: unknown[]) =>
      (toastSuccessMock as (...a: unknown[]) => unknown)(...args),
    error: (...args: unknown[]) =>
      (toastErrorMock as (...a: unknown[]) => unknown)(...args),
    loading: (...args: unknown[]) =>
      (toastLoadingMock as (...a: unknown[]) => string)(...args),
    dismiss: (...args: unknown[]) =>
      (toastDismissMock as (...a: unknown[]) => unknown)(...args),
  }),
}));

vi.mock("axios", async () => {
  const actual = await vi.importActual<typeof import("axios")>("axios");
  return {
    ...actual,
    isAxiosError: (...args: unknown[]) => isAxiosErrorMock(...args),
  };
});

describe("toast utils", () => {
  it("isNoDataError returns true for ApiError rawMessage matching 'no data'", async () => {
    const { isNoDataError } = await import("../toast");

    const err = new ApiError({
      message: "msg",
      rawMessage: "No data for range",
    });
    expect(isNoDataError(err)).toBe(true);
  });

  it("isNoDataError returns true for ApiError code 404", async () => {
    const { isNoDataError } = await import("../toast");

    const err = new ApiError({
      message: "msg",
      code: 404,
      rawMessage: "whatever",
    });
    expect(isNoDataError(err)).toBe(true);
  });

  it("isNoDataError returns true for axios error with 404", async () => {
    const { isNoDataError } = await import("../toast");

    const axiosErr = { response: { status: 404 } };
    isAxiosErrorMock.mockImplementation((e: unknown) => e === axiosErr);

    expect(isNoDataError(axiosErr)).toBe(true);
  });

  it("isNoDataError returns false when error is not a no-data condition", async () => {
    const { isNoDataError } = await import("../toast");

    isAxiosErrorMock.mockReturnValue(false);
    expect(isNoDataError(new Error("boom"))).toBe(false);

    const axiosErr = { response: { status: 500 } };
    isAxiosErrorMock.mockImplementation((e: unknown) => e === axiosErr);
    expect(isNoDataError(axiosErr)).toBe(false);

    const apiErr = new ApiError({
      message: "msg",
      code: 400,
      rawMessage: "other",
    });
    expect(isNoDataError(apiErr)).toBe(false);
  });

  it("getPublicErrorMessage returns generic message when status is missing", async () => {
    const { getPublicErrorMessage } = await import("../toast");

    isAxiosErrorMock.mockReturnValue(false);
    expect(getPublicErrorMessage(new Error("x"))).toContain("inesperado");
  });

  it("getPublicErrorMessage uses axios status codes", async () => {
    const { getPublicErrorMessage } = await import("../toast");

    const axiosErr = { response: { status: 500 } };
    isAxiosErrorMock.mockImplementation((e: unknown) => e === axiosErr);

    expect(getPublicErrorMessage(axiosErr)).toContain("problemas");

    const axiosErr400 = { response: { status: 400 } };
    isAxiosErrorMock.mockImplementation((e: unknown) => e === axiosErr400);
    expect(getPublicErrorMessage(axiosErr400)).toContain("No se pudo procesar");
  });

  it("getPublicErrorMessage covers 401/403/404/414 and default branches", async () => {
    const { getPublicErrorMessage } = await import("../toast");

    const axios401 = { response: { status: 401 } };
    isAxiosErrorMock.mockImplementation((e: unknown) => e === axios401);
    expect(getPublicErrorMessage(axios401)).toContain("validar el acceso");

    const axios403 = { response: { status: 403 } };
    isAxiosErrorMock.mockImplementation((e: unknown) => e === axios403);
    expect(getPublicErrorMessage(axios403)).toContain("permisos");

    const axios404 = { response: { status: 404 } };
    isAxiosErrorMock.mockImplementation((e: unknown) => e === axios404);
    expect(getPublicErrorMessage(axios404)).toContain("No se encontró");

    const axios414 = { response: { status: 414 } };
    isAxiosErrorMock.mockImplementation((e: unknown) => e === axios414);
    expect(getPublicErrorMessage(axios414)).toContain("demasiado largo");

    const axios418 = { response: { status: 418 } };
    isAxiosErrorMock.mockImplementation((e: unknown) => e === axios418);
    expect(getPublicErrorMessage(axios418)).toContain(
      "Ocurrió un error al procesar",
    );
  });

  it("getPublicErrorMessage uses ApiError code when not axios", async () => {
    const { getPublicErrorMessage } = await import("../toast");

    isAxiosErrorMock.mockReturnValue(false);
    const err = new ApiError({ message: "msg", code: 429 });

    expect(getPublicErrorMessage(err)).toContain("demasiadas");
  });

  it("show*Toast helpers call react-hot-toast methods", async () => {
    const {
      showSuccessToast,
      showErrorToast,
      showInfoToast,
      showLoadingToast,
      dismissToast,
    } = await import("../toast");

    showSuccessToast("ok");
    expect(toastSuccessMock).toHaveBeenCalledWith("ok");

    showErrorToast("err");
    expect(toastErrorMock).toHaveBeenCalledWith("err");

    showInfoToast("info");
    expect(toastFn).toHaveBeenCalledWith(
      "info",
      expect.objectContaining({ icon: expect.any(String) }),
    );

    const id = showLoadingToast("loading");
    expect(id).toBe("toast-id");
    expect(toastLoadingMock).toHaveBeenCalledWith("loading");

    dismissToast("toast-id");
    expect(toastDismissMock).toHaveBeenCalledWith("toast-id");
  });
});
