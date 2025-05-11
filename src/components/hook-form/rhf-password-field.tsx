import { IconButton, InputAdornment } from '@mui/material';
import { RHFTextField, TRHFTextFieldProps } from './rhf-text-field';
import { Iconify } from '../iconify';
import { useBoolean } from 'src/hooks/use-boolean';

// ----------------------------------------------------------------------
export type TRHFPasswordFieldProps = TRHFTextFieldProps;

export function RHFPasswordField(props: TRHFPasswordFieldProps) {
  const password = useBoolean();
  return (
    <RHFTextField
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={password.onToggle} edge="end">
              <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
            </IconButton>
          </InputAdornment>
        ),
      }}
      type={password.value ? 'text' : 'password'}
      {...props}
    />
  );
}
