import { describe, expect, it, vi } from "vitest";
import { render, screen, userEvent } from "../../../test/utils";
import RealTimeStatusBar from "../../molecules/RealTimeStatusBar";

describe("RealTimeStatusBar", () => {
  it("renders paused state and toggles on button click", async () => {
    const onTogglePause = vi.fn();

    render(
      <RealTimeStatusBar
        paused={true}
        hasNoData={false}
        isUpdating={false}
        onTogglePause={onTogglePause}
      />,
    );

    expect(screen.getByText(/Tiempo real: Pausado/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Reanudar" }));

    expect(onTogglePause).toHaveBeenCalledTimes(1);
  });

  it("renders active state with updating and no-data flags", () => {
    const { rerender } = render(
      <RealTimeStatusBar
        paused={false}
        hasNoData={false}
        isUpdating={true}
        onTogglePause={() => undefined}
      />,
    );

    expect(screen.getByText(/Tiempo real: Activo/i)).toBeInTheDocument();
    expect(screen.getByText(/actualizando/i)).toBeInTheDocument();

    rerender(
      <RealTimeStatusBar
        paused={false}
        hasNoData={true}
        isUpdating={false}
        onTogglePause={() => undefined}
      />,
    );

    expect(screen.getByText(/sin datos/i)).toBeInTheDocument();
  });
});
