import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';

import { Form, Field } from 'src/components/hook-form';

import { FormHead } from '../components/form-head';
import { emailRegExp } from 'src/utils';
import { FormReturnLink } from '../components/form-return-link';
import { ForgotPasswordRequest } from 'src/data/auth/auth.model';
import { toast } from 'src/components/snackbar';
import { forgotPasswordAsync } from 'src/services/auth/auth.service';
import Typography from '@mui/material/Typography';
import { useBoolean } from 'src/hooks/use-boolean';
import { useCountdownSeconds } from 'src/hooks/use-countdown';
import Button from '@mui/material/Button';
import { ButtonBase } from '@mui/material';

// ----------------------------------------------------------------------

export function ForgotPasswordView() {
  const isSentEmail = useBoolean();
  const countdown = useCountdownSeconds(30);
  const [errorMsg, setErrorMsg] = useState('');

  const methods = useForm<ForgotPasswordRequest>({
    defaultValues: {
      email: '',
    },
  });

  const {
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleSendEmailResetPassword = async (data: ForgotPasswordRequest) => {
    try {
      const response = await forgotPasswordAsync(data);
      if (response.success) {
        toast.success('Sent email message reset password successfully!');
        isSentEmail.onTrue();
        countdown.setValue(30);
        countdown.start();
        setErrorMsg('');
      }
    } catch (error: any) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  };

  const onSubmit = handleSubmit(handleSendEmailResetPassword);

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

      <LoadingButton
        fullWidth
        color="error"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Reset password..."
      >
        Reset password
      </LoadingButton>
    </Box>
  );

  return (
    <>
      {!isSentEmail.value ? (
        <>
          <FormHead
            title="Forgot your password?"
            description="Please enter the email address associated with your account and we'll email you a link to reset your password."
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
        </>
      ) : (
        <>
          <FormHead
            title="Check your email"
            description={
              <>
                <Typography component="span">
                  We have send a password recovery instructions to your email address. Didn't
                  receive the email? Check your spam folder or try{' '}
                  <Button
                    color="error"
                    size="small"
                    variant="contained"
                    disabled={countdown.isCounting}
                    onClick={() => {
                      handleSendEmailResetPassword(getValues());
                    }}
                  >
                    Re-send the email
                  </Button>
                  {countdown.isCounting && (
                    <Typography component="span">
                      {' '}
                      after <span className="text-blue-500">{countdown.value}</span> seconds.
                    </Typography>
                  )}
                </Typography>
              </>
            }
            sx={{ textAlign: { xs: 'center', md: 'left' }, mb: 2 }}
          />
        </>
      )}

      <FormReturnLink href={paths.auth.signIn} />
    </>
  );
}
