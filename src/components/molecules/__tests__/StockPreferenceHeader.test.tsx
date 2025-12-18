import { describe, expect, it, vi } from "vitest";
import { render, screen, userEvent } from "../../../test/utils";
import StockPreferenceHeader from "../../molecules/StockPreferenceHeader";

describe("StockPreferenceHeader", () => {
  it("renders symbol/name/currency and triggers onBack", async () => {
    const onBack = vi.fn();

    render(
      <StockPreferenceHeader
        symbol="AAL"
        name="American Airlines"
        currency="USD"
        onBack={onBack}
      />,
    );

    expect(
      screen.getByText(/AAL - American Airlines - USD/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Usuario: Juan/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Volver" }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
