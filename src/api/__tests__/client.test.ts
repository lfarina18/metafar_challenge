import { describe, expect, it, vi } from "vitest";

const axiosCreateMock = vi.fn();

vi.mock("axios", () => ({
  default: {
    create: (...args: unknown[]) => axiosCreateMock(...args),
  },
}));

describe("apiClient", () => {
  it("creates an axios client with baseURL and api key param", async () => {
    axiosCreateMock.mockReturnValue({});

    vi.stubEnv("VITE_BASE_URL", "https://example.test");
    vi.stubEnv("VITE_TWELVE_DATA_API_KEY", "test-key");

    await import("../client");

    expect(axiosCreateMock).toHaveBeenCalledWith({
      baseURL: "https://example.test",
      params: {
        apikey: "test-key",
      },
    });
  });
});
