import { describe, expect, it, vi } from "vitest";
import { render, screen, userEvent } from "../../../test/utils";
import Button from "../../atoms/Button";

describe("Button", () => {
  it("renders children and calls onClick", async () => {
    const onClick = vi.fn();

    render(
      <Button type="button" variant="contained" onClick={onClick}>
        Click me
      </Button>,
    );

    const btn = screen.getByRole("button", { name: "Click me" });
    await userEvent.click(btn);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
