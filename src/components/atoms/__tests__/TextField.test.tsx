import { describe, expect, it, vi } from "vitest";
import { useState } from "react";
import { render, screen, userEvent } from "../../../test/utils";
import TextField from "../../atoms/TextField";

describe("TextField", () => {
  it("renders label and calls onChange", async () => {
    const onChange = vi.fn();

    const Wrapper = () => {
      const [value, setValue] = useState("");
      return (
        <TextField
          label="Buscar"
          value={value}
          onChange={(e) => {
            onChange(e);
            setValue(e.target.value);
          }}
          fullWidth={true}
        />
      );
    };

    render(<Wrapper />);

    const input = screen.getByLabelText("Buscar");
    await userEvent.type(input, "AAPL");

    expect(onChange).toHaveBeenCalled();
    expect(input).toHaveValue("AAPL");
  });
});
