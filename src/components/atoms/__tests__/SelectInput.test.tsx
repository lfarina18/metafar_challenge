import { describe, expect, it, vi } from "vitest";
import { render, screen, userEvent } from "../../../test/utils";
import SelectInput from "../../atoms/SelectInput";

describe("SelectInput", () => {
  it("renders options and calls onChange", async () => {
    const onChange = vi.fn();

    render(
      <SelectInput
        id="interval"
        ariaLabel="Intervalo"
        value="5min"
        onChange={onChange}
        options={[
          { value: "1min", label: "1 minuto" },
          { value: "5min", label: "5 minutos" },
        ]}
      />,
    );

    const select = screen.getByLabelText("Intervalo");
    expect(select).toHaveValue("5min");

    await userEvent.selectOptions(select, "1min");

    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
