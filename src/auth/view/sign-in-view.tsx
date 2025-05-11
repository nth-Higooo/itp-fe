import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from '../hooks';
import { FormHead } from '../components/form-head';
import { emailRegExp } from 'src/utils';
import { FormReturnLink } from '../components/form-return-link';
import { SignInRequest } from 'src/data/auth/auth.model';
import { useAppDispatch } from 'src/redux/store';
import { loginAsync } from 'src/services/auth/auth.service';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { checkUserSession }: any = useAuthContext();

  const [errorMsg, setErrorMsg] = useState('');

  const methods = useForm<SignInRequest>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const onSubmit = handleSubmit(async (data: SignInRequest) => {
    try {
      const response = await dispatch(loginAsync(data));
      if (response.meta.requestStatus === 'rejected') {
        return;
      }
      await checkUserSession?.();

      router.push(paths.dashboard.root);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });
  useEffect(() => {
    checkUserSession?.();

    // router.refresh();
  }, []);
  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Field.Text
        rules={{
          required: {
            value: true,
            message: 'Email address is required.',
          },
          pattern: {
            value: emailRegExp,
            message: 'Please enter an valid email address.',
          },
        }}
        name="email"
        label="Email address"
      />

      <Field.Password
        rules={{
          required: {
            value: true,
            message: 'Password is required.',
          },
        }}
        name="password"
        label="Password"
      />

      <LoadingButton
        fullWidth
        color="error"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Sign in..."
      >
        Sign in
      </LoadingButton>

      <Field.Switch
        name="rememberMe"
        labelPlacement="start"
        label={
          <>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              Remember me
            </Typography>
          </>
        }
        sx={{ mx: 0, mt: -3 }}
      />
    </Box>
  );

  return (
    <>
      <FormHead
        title="Sign in to your account"
        description="By entering your email address and password."
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

      <FormReturnLink icon={<></>} href={paths.auth.forgotPassword} label="Forgot password?" />
    </>
  );
}
