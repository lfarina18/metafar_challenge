import { describe, expect, it, vi } from "vitest";
import { useState } from "react";
import { render, screen, userEvent } from "../../../test/utils";
import DateInput from "../../atoms/DateInput";

describe("DateInput", () => {
  it("renders with value and calls onChange", async () => {
    const onChange = vi.fn();

    const Wrapper = () => {
      const [value, setValue] = useState("2025-01-01T10:00");
      return (
        <DateInput
          id="start"
          ariaLabel="Desde"
          disabled={false}
          value={value}
          onChange={(e) => {
            onChange(e);
            setValue(e.target.value);
          }}
        />
      );
    };

    render(<Wrapper />);

    const input = screen.getByLabelText("Desde");
    expect(input).toHaveValue("2025-01-01T10:00");

    await userEvent.clear(input);
    await userEvent.type(input, "2025-01-01T11:00");

    expect(onChange).toHaveBeenCalled();
    expect(input).toHaveValue("2025-01-01T11:00");
  });

  it("can be disabled", () => {
    render(
      <DateInput
        id="start"
        ariaLabel="Desde"
        disabled
        value="2025-01-01T10:00"
        onChange={() => undefined}
      />,
    );

    expect(screen.getByLabelText("Desde")).toBeDisabled();
  });
});
