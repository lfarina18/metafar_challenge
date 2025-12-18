import { describe, expect, it } from "vitest";
import { render, screen } from "../../../test/utils";
import { Table, TableBody } from "@mui/material";
import TableRowsSkeleton from "../../molecules/TableRowsSkeleton";

describe("TableRowsSkeleton", () => {
  it("renders the requested number of skeleton rows", () => {
    render(
      <Table>
        <TableBody>
          <TableRowsSkeleton rows={3} />
        </TableBody>
      </Table>,
    );

    const rows = screen.getAllByRole("row");
    expect(rows.length).toBe(3);
  });
});
