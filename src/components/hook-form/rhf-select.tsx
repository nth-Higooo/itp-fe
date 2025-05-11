import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Select, { SelectProps } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl, { FormControlProps } from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { Autocomplete } from '@mui/material';

// ----------------------------------------------------------------------
export type TRHFSelectProps = TextFieldProps & {
  name: string;
  rules?: any;
  slotProps?: any;
  native?: any;
};

export function RHFSelect({
  rules,
  name,
  native,
  children,
  slotProps,
  helperText,
  inputProps,
  InputLabelProps,
  ...other
}: TRHFSelectProps) {
  const { control } = useFormContext();

  const labelId = `${name}-select-label`;

  return (
    <Controller
      rules={rules}
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          SelectProps={{
            native,
            MenuProps: { PaperProps: { sx: { maxHeight: 220, ...slotProps?.paper } } },
            sx: { textTransform: 'capitalize' },
            value: field.value ?? '',
          }}
          InputLabelProps={{ htmlFor: labelId, ...InputLabelProps }}
          inputProps={{ id: labelId, ...inputProps }}
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
        >
          {children}
        </TextField>
      )}
    />
  );
}

// ----------------------------------------------------------------------
export type TRHFMultiSelectProps = FormControlProps & {
  rules?: any;
  name?: any;
  chip?: any;
  renderOptions?: any;
  getOptionLabel?: any;
  label?: string;
  options?: any;
  checkbox?: any;
  placeholder?: string;
  slotProps?: any;
  helperText?: any;
};

export function RHFMultiSelect({
  rules,
  name,
  chip,
  label,
  options,
  checkbox,
  placeholder,
  slotProps,
  helperText,
  ...other
}: TRHFMultiSelectProps) {
  const { control } = useFormContext();

  const labelId = `${name}-select-label`;

  return (
    <Controller
      rules={rules}
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error} {...other}>
          {label && (
            <InputLabel htmlFor={labelId} {...slotProps?.inputLabel}>
              {label}
            </InputLabel>
          )}

          <Select
            {...field}
            multiple
            displayEmpty={!!placeholder}
            label={label}
            renderValue={(selected: any) => {
              const selectedItems = options.filter((item: any) => selected.includes(item.value));
              if (!selectedItems.length && placeholder) {
                return <Box sx={{ color: 'text.disabled' }}>{placeholder}</Box>;
              }

              if (chip) {
                return (
                  <Box sx={{ gap: 0.5, display: 'flex', flexWrap: 'wrap' }}>
                    {selectedItems.map((item: any) => (
                      <Chip
                        key={item.value}
                        size="small"
                        variant="soft"
                        label={item.label}
                        {...slotProps?.chip}
                      />
                    ))}
                  </Box>
                );
              }

              return selectedItems.map((item: any) => item.label).join(', ');
            }}
            {...slotProps?.select}
            inputProps={{ id: labelId, ...slotProps?.select?.inputProps }}
          >
            {options.map((option: any) => (
              <MenuItem key={option.value} value={option.value}>
                {checkbox && (
                  <Checkbox
                    size="small"
                    disableRipple
                    checked={field.value?.includes(option.value)}
                    {...slotProps?.checkbox}
                  />
                )}

                {option.label}
              </MenuItem>
            ))}
          </Select>

          {(!!error || helperText) && (
            <FormHelperText error={!!error} {...slotProps?.formHelperText}>
              {error ? error?.message : helperText}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}
export function RHFAutoComplete({
  rules,
  name,
  slotProps,
  getOptionLabel,

  renderOptions,
  label,
  helperText,
  options,
  ...other
}: TRHFMultiSelectProps) {
  const { control } = useFormContext();

  return (
    <Controller
      rules={rules}
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          value={options.find((option: any) => option.id === field.value) || null}
          onChange={(event, newValue: any) => {
            field.onChange(newValue.id);
          }}
          fullWidth
          options={options}
          getOptionLabel={getOptionLabel}
          isOptionEqualToValue={(option: any, value) => option.id === value.id}
          renderInput={(params) => <TextField {...params} label={label} margin="none" />}
          renderOption={renderOptions}
        />
      )}
    />
  );
}
