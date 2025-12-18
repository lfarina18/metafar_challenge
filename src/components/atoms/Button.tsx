import Button from "@mui/material/Button";
import { IButtonProps } from "../../types";
import type { FC } from "react";

const CustomButton: FC<IButtonProps> = ({
  type,
  variant,
  children,
  style,
  onClick,
  sx,
}) => (
  <Button type={type} variant={variant} style={style} onClick={onClick} sx={sx}>
    {children}
  </Button>
);

export default CustomButton;
