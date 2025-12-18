import { z } from "zod";
import { ApiErrorResponseSchema } from "../../api/schemas";

export class ApiError extends Error {
  public readonly code?: number;
  public readonly rawMessage?: string;

  constructor(params: { message: string; code?: number; rawMessage?: string }) {
    super(params.message);
    this.name = "ApiError";
    this.code = params.code;
    this.rawMessage = params.rawMessage;
  }
}

export const validateResponse = <T>(
  data: unknown,
  schema: z.ZodSchema<T>,
): T => {
  const errorCheck = ApiErrorResponseSchema.safeParse(data);
  if (errorCheck.success) {
    throw new ApiError({
      message:
        "Error en la respuesta del servicio, consulte a soporte técnico para más información.",
      code: errorCheck.data.code,
      rawMessage: errorCheck.data.message,
    });
  }

  const result = schema.safeParse(data);
  if (!result.success) {
    console.error("Validation error:", result.error.issues);
    throw new Error(
      "Error en la respuesta del servicio, consulte a soporte técnico para más información.",
    );
  }

  return result.data;
};
