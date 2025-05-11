import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { Form, Field } from 'src/components/hook-form';
import { CardContent } from '@mui/material';
import { useAppDispatch } from 'src/redux/store';
import { passwordRegExp } from 'src/utils';
import { changePasswordAsync } from 'src/services/personal.service';
import { toast } from 'src/components/snackbar';
import { doLogout } from 'src/services/auth/auth.service';
import { useAuthContext } from 'src/auth/hooks';
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export function ChangePasswordForm() {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const { checkUserSession }: any = useAuthContext();

  const methods = useForm<any>({
    mode: 'onSubmit',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const {
    reset,
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data: any) => {
    try {
      const response = await dispatch(changePasswordAsync(data));
      if (response.meta.requestStatus === 'fulfilled') {
        toast.success('Change password successfully!');
        reset();
        try {
          doLogout();
          await checkUserSession?.();
          router.refresh();
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={21} md={6} xl={5}>
          <Card>
            <CardContent>
              <Box display="flex" gap={3} flexDirection="column">
                <Typography>
                  Your new password must have at least 8 characters and least one lowercase letter,
                  uppercase letter, number and symbol.
                </Typography>
                <Field.Password
                  rules={{
                    required: {
                      value: true,
                      message: 'Current password is required.',
                    },
                  }}
                  name="currentPassword"
                  label="Current Password"
                />
                <Field.Password
                  rules={{
                    required: {
                      value: true,
                      message: 'New password is required.',
                    },
                    pattern: {
                      value: passwordRegExp,
                      message: 'Please enter an valid password.',
                    },
                  }}
                  name="newPassword"
                  label="New Password"
                />
                <Field.Password
                  rules={{
                    required: {
                      value: true,
                      message: 'Confirm new password is required.',
                    },
                    validate: (value: string) => {
                      return (
                        value === getValues('newPassword') || 'Confirm new password does not match'
                      );
                    },
                  }}
                  name="confirmNewPassword"
                  label="Confirm new Password"
                />
              </Box>
            </CardContent>
            <Stack spacing={1.5} direction="row" justifyContent="flex-end" sx={{ p: 3, pt: 0 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
