import { Controller, useFormContext, ValidationRule } from 'react-hook-form';

import TextField, { TextFieldProps } from '@mui/material/TextField';

// ----------------------------------------------------------------------
export type TRHFTextFieldProps = TextFieldProps & {
  name: string;
  rules?: any;
};

export function RHFTextField({ rules, name, helperText, type, ...other }: TRHFTextFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      rules={rules}
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type={type}
          value={type === 'number' && field.value === 0 ? '' : field.value}
          onChange={(event) => {
            if (type === 'number') {
              field.onChange(Number(event.target.value));
            } else {
              field.onChange(event.target.value);
            }
          }}
          error={!!error}
          helperText={error?.message ?? helperText}
          inputProps={{
            autoComplete: 'off',
          }}
          {...other}
        />
      )}
    />
  );
}
