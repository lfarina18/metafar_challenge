import * as React from "react";
import { TextField } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

interface ISearchFieldProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
}

const SearchField: React.FC<ISearchFieldProps> = ({
  label,
  value,
  onChange,
  fullWidth = true,
  sx,
}) => (
  <TextField
    label={label}
    variant="outlined"
    value={value}
    onChange={onChange}
    fullWidth={fullWidth}
    sx={sx}
  />
);

export default React.memo(SearchField);
