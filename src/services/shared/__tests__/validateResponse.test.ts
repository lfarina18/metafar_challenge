import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { ApiError, validateResponse } from "../validateResponse";

describe("validateResponse", () => {
  it("returns parsed data when schema validation succeeds", () => {
    const schema = z.object({ foo: z.string() });

    const result = validateResponse({ foo: "bar" }, schema);

    expect(result).toEqual({ foo: "bar" });
  });

  it("throws ApiError when API returns error payload", () => {
    const schema = z.object({ foo: z.string() });

    expect(() =>
      validateResponse(
        { status: "error", message: "No data", code: 404 },
        schema,
      ),
    ).toThrow(ApiError);

    try {
      validateResponse(
        { status: "error", message: "No data", code: 404 },
        schema,
      );
    } catch (e) {
      const err = e as ApiError;
      expect(err.name).toBe("ApiError");
      expect(err.code).toBe(404);
      expect(err.rawMessage).toBe("No data");
    }
  });

  it("logs validation issues and throws generic error when schema validation fails", () => {
    const schema = z.object({ foo: z.string() });
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    expect(() => validateResponse({ foo: 123 }, schema)).toThrow(
      "Error en la respuesta del servicio, consulte a soporte técnico para más información.",
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Validation error:",
      expect.any(Array),
    );

    consoleErrorSpy.mockRestore();
  });
});
