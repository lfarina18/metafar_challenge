import { describe, expect, it, vi } from "vitest";
import { render, screen, userEvent } from "../../../test/utils";
import IntervalSelect from "../../molecules/IntervalSelect";

describe("IntervalSelect", () => {
  it("renders label and allows selecting an interval", async () => {
    const onChange = vi.fn();

    render(<IntervalSelect value="5min" onChange={onChange} />);

    const select = screen.getByLabelText("Intervalo");
    expect(select).toHaveValue("5min");

    await userEvent.selectOptions(select, "1min");

    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
