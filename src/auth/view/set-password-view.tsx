import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from '../hooks';
import { FormHead } from '../components/form-head';
import { passwordRegExp } from 'src/utils';
import { FormReturnLink } from '../components/form-return-link';
import { ResetPasswordRequest } from 'src/data/auth/auth.model';
import { resetPasswordAsync } from 'src/services/auth/auth.service';
import { toast } from 'src/components/snackbar';

// ----------------------------------------------------------------------

export function SetPasswordView() {
  const { resetToken } = useParams();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const methods = useForm<ResetPasswordRequest>({
    defaultValues: {
      password: '',
      confirmPassword: '',
      resetToken,
    },
  });

  const {
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data: ResetPasswordRequest) => {
    try {
      const response = await resetPasswordAsync(data);
      if (response.success) {
        toast.success('Set password successfully!');
        setErrorMsg('');
        router.push(paths.auth.signIn);
      }
    } catch (error: any) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Field.Password
        rules={{
          required: {
            value: true,
            message: 'Password is required.',
          },
          pattern: {
            value: passwordRegExp,
            message: 'Please enter an valid password.',
          },
        }}
        name="password"
        label="Password"
      />

      <Field.Password
        rules={{
          required: {
            value: true,
            message: 'Confirm password is required.',
          },
          validate: (value: string) => {
            return value === getValues('password') || 'Confirm password does not match';
          },
        }}
        name="confirmPassword"
        label="Confirm password"
      />

      <LoadingButton
        fullWidth
        color="error"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Set password..."
      >
        Set password
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        title="Set password"
        description="Your new password must have at least 8 characters and least one lowercase letter, uppercase letter, number and symbol."
        sx={{ textAlign: { xs: 'center', md: 'left' } }}
      />

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>

      <FormReturnLink href={'/'} />
    </>
  );
}
