import { TextField } from "@mui/material";

export default function FormTextField({ error, ...props }) {
  return <TextField fullWidth error={Boolean(error)} helperText={error} {...props} />;
}