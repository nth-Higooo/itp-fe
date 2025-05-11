import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { CardHeader, Divider, IconButton, SvgIcon } from '@mui/material';
import { useAppDispatch } from 'src/redux/store';
import { updateEmployeeAsync } from 'src/services/employee/employee.service';
import { phoneRegExp } from 'src/utils';
import { EmergencyContact } from 'src/data/employee/onboarding.model';
import { EmployeeTabProps } from './employee-tab-general';
import { setEmployeeRequestChange } from 'src/redux/employee/employees.slice';

// ----------------------------------------------------------------------

export function EmployeeTabEmergency({ currentEmployee, canEdit, role }: EmployeeTabProps) {
  const dispatch = useAppDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const onToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };
  const defaultValues = useMemo(
    () => ({
      ecRelationship: currentEmployee?.ecRelationship || '',
      ecName: currentEmployee?.ecName || '',
      ecPhoneNumber: currentEmployee?.ecPhoneNumber || '',
    }),
    [currentEmployee]
  );
  const methods = useForm<EmergencyContact>({
    mode: 'onSubmit',
    defaultValues: defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const { unsubscribe } = watch((value) => {
      dispatch(setEmployeeRequestChange(value));
    });
    return () => unsubscribe();
  }, [watch]);

  const onSubmit = handleSubmit(async (data: EmergencyContact) => {
    try {
      const payload = {
        id: currentEmployee?.id,
        ...data,
      };
      if (!currentEmployee) {
        // const response = await dispatch(addEmployeeAsync(payload));
        // if (response.meta.requestStatus === 'fulfilled') {
        //   toast.success('Add employee successfully!');
        // }
      } else {
        const response = await dispatch(updateEmployeeAsync(payload));
        if (response.meta.requestStatus === 'fulfilled') {
          toast.success('Update employee successfully!');
        }
      }
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => {
    reset(defaultValues);
  }, [currentEmployee]);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Card>
            <CardHeader
              title="Emergency Contact"
              sx={{ mb: 3 }}
              action={
                <IconButton size="small" onClick={onToggleExpand} sx={{ marginLeft: 2 }}>
                  <SvgIcon
                    sx={{
                      width: 16,
                      height: 16,
                      transform: isExpanded ? 'rotate(270deg)' : 'rotate(90deg)',
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    <path
                      fill="currentColor"
                      d="M13.83 19a1 1 0 0 1-.78-.37l-4.83-6a1 1 0 0 1 0-1.27l5-6a1 1 0 0 1 1.54 1.28L10.29 12l4.32 5.36a1 1 0 0 1-.78 1.64"
                    />
                  </SvgIcon>
                </IconButton>
              }
            />
            {isExpanded && (
              <Stack>
                <Stack sx={{ p: 3 }}>
                  <Box
                    rowGap={3}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      md: 'repeat(2, 1fr)',
                      lg: 'repeat(3, 1fr)',
                    }}
                  >
                    <Field.Text
                      disabled={!canEdit}
                      rules={{
                        required: {
                          value: true,
                          message: 'Relationship is required.',
                        },
                      }}
                      label="Relationship"
                      name="ecRelationship"
                    />
                    <Field.Text
                      disabled={!canEdit}
                      rules={{
                        required: {
                          value: true,
                          message: 'Full Name is required.',
                        },
                      }}
                      label="Full Name"
                      name="ecName"
                    />
                    <Field.Text
                      disabled={!canEdit}
                      rules={{
                        required: {
                          value: true,
                          message: 'Phone Number is required.',
                        },
                        pattern: {
                          value: phoneRegExp,
                          message: 'Please enter an valid phone number.',
                        },
                      }}
                      label="Phone Number"
                      name="ecPhoneNumber"
                    />
                  </Box>
                </Stack>
                {role === 'Employer' ? (
                  <>
                    <Divider sx={{ borderStyle: 'dashed' }} />

                    <Stack spacing={1.5} direction="row" justifyContent="flex-end" sx={{ p: 3 }}>
                      <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        {'Save changes'}
                      </LoadingButton>
                    </Stack>
                  </>
                ) : (
                  <></>
                )}
              </Stack>
            )}
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
