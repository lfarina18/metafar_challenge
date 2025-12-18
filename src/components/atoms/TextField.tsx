import { TextField } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { memo } from "react";
import type { FC, ChangeEvent } from "react";

interface ISearchFieldProps {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
}

const SearchField: FC<ISearchFieldProps> = ({
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

export default memo(SearchField);
