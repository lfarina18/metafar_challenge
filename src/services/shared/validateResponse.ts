import { z } from "zod";
import { ApiErrorResponseSchema } from "../../api/schemas";

export const validateResponse = <T>(
  data: unknown,
  schema: z.ZodSchema<T>
): T => {
  const errorCheck = ApiErrorResponseSchema.safeParse(data);
  if (errorCheck.success) {
    throw new Error(errorCheck.data.message);
  }

  const result = schema.safeParse(data);
  if (!result.success) {
    console.error("Validation error:", result.error.issues);
    throw new Error(
      `Invalid API response: ${result.error.issues
        .map((e) => e.message)
        .join(", ")}`
    );
  }

  return result.data;
};
