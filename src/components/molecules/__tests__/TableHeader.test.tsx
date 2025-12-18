import { describe, expect, it } from "vitest";
import { render, screen } from "../../../test/utils";
import { Table } from "@mui/material";
import TableHeader from "../../molecules/TableHeader";

describe("TableHeader", () => {
  it("renders all column headers", () => {
    render(
      <Table>
        <TableHeader />
      </Table>,
    );

    expect(screen.getByRole("columnheader", { name: "Símbolo" })).toBeDefined();
    expect(
      screen.getByRole("columnheader", { name: "Exchange" }),
    ).toBeDefined();
    expect(screen.getByRole("columnheader", { name: "Nombre" })).toBeDefined();
    expect(screen.getByRole("columnheader", { name: "Moneda" })).toBeDefined();
    expect(screen.getByRole("columnheader", { name: "Tipo" })).toBeDefined();
  });
});
