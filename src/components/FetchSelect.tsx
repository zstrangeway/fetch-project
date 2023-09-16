import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Key } from 'react';

export interface FetchSelectOption<OptionValueType> {
  label: string;
  value: OptionValueType;
}

export interface FetchSelectProps<OptionValueType, ValueType> {
  id: string;
  label: string;
  onChange: ((event: SelectChangeEvent<unknown>, child: React.ReactNode) => void);
  options: FetchSelectOption<OptionValueType>[];
  value: ValueType;
}

export default function FetchSelect<OptionValueType extends Key, ValueType>(
  props: FetchSelectProps<OptionValueType, ValueType>,
) {
  const {
    id,
    label,
    onChange,
    options,
    value,
  } = props;

  const labelId = `${id}-label`;

  return (
    <FormControl size="small" fullWidth>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        id={id}
        labelId={labelId}
        value={value}
        label={label}
        onChange={onChange}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
