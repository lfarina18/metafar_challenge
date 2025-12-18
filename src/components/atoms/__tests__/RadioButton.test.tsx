import { describe, expect, it, vi } from "vitest";
import { render, screen, userEvent } from "../../../test/utils";
import RadioButton from "../../atoms/RadioButton";

describe("RadioButton", () => {
  it("renders a radio input and toggles via label click", async () => {
    const onChange = vi.fn();

    render(
      <RadioButton
        name="dataOption"
        value="realtime"
        checked={false}
        onChange={onChange}
        label="Tiempo Real"
      />,
    );

    const radio = screen.getByRole("radio", { name: "Tiempo Real" });
    expect(radio).not.toBeChecked();

    await userEvent.click(screen.getByText("Tiempo Real"));

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("uses provided id when available", () => {
    render(
      <RadioButton
        id="custom-id"
        name="dataOption"
        value="realtime"
        checked={true}
        onChange={() => undefined}
        label="Tiempo Real"
      />,
    );

    expect(screen.getByRole("radio", { name: "Tiempo Real" })).toHaveAttribute(
      "id",
      "custom-id",
    );
  });
});
