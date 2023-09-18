import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";

export interface FetchTextFieldProps {
  id: string;
  label: string;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  value: unknown;
  disabled?: boolean;
}

export default function FetchTextField(props: FetchTextFieldProps) {
  const { disabled, id, label, onChange, value } = props;

  return (
    <FormControl fullWidth>
      <TextField
        id={id}
        label={label}
        value={value}
        onChange={onChange}
        variant="outlined"
        size="small"
        disabled={disabled}
      />
    </FormControl>
  );
}
