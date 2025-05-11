import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { CardHeader, Divider, IconButton, MenuItem, SvgIcon } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { updateEmployeeAsync } from 'src/services/employee/employee.service';
import { OthersInfo } from 'src/data/employee/onboarding.model';
import { EmployeeTabProps } from './employee-tab-general';
import { setEmployeeRequestChange } from 'src/redux/employee/employees.slice';
import { selectSelections } from 'src/redux/selections/selections.slice';
import { getTimeKeeperUsersAsync } from 'src/services/selection.service';

// ----------------------------------------------------------------------

export function EmployeeTabOthers({ currentEmployee, canEdit, role }: EmployeeTabProps) {
  const dispatch = useAppDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const onToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };
  const { timekeeperUsers, getTimeKeeperStatus } = useAppSelector(selectSelections);
  const defaultValues = useMemo(
    () => ({
      fingerprintId: currentEmployee?.fingerprintId || '',
      payslipPassword: currentEmployee?.payslipPassword || '',
      resignDate: currentEmployee?.resignDate || '',
      leaveDate: currentEmployee?.leaveDate || '',
      resignReason: currentEmployee?.resignReason || '',
    }),
    [currentEmployee]
  );
  const methods = useForm<OthersInfo>({
    mode: 'onSubmit',
    defaultValues: defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const resignDate = watch('resignDate');

  useEffect(() => {
    const { unsubscribe } = watch((value) => {
      dispatch(setEmployeeRequestChange(value));
    });
    return () => unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (getTimeKeeperStatus === 'idle') {
      dispatch(getTimeKeeperUsersAsync());
    }
  }, []);

  const onSubmit = handleSubmit(async (data: OthersInfo) => {
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
              title="Others"
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
                    }}
                  >
                    <Field.DatePicker disabled={!canEdit} name="leaveDate" label="Leave Date" />
                    <Field.DatePicker disabled={!canEdit} name="resignDate" label="Resign Date" />

                    <Field.Text
                      disabled={!canEdit}
                      rules={{
                        validate: (value: any) => {
                          if (resignDate && !value) {
                            return 'Resign Reason is required when a resign date is set.';
                          }
                          return true;
                        },
                      }}
                      label="Resign Reason"
                      name="resignReason"
                      sx={{ gridColumn: 'span 2' }}
                    />

                    {/* Fingerprint Id and Payslip Password */}
                    <Field.Select
                      disabled={!canEdit}
                      name="fingerprintId"
                      label="Fingerprint Id"
                      rules={{
                        required: 'Fingerprint Id required.',
                      }}
                      InputLabelProps={{ shrink: true }}
                    >
                      {timekeeperUsers?.map((option: any) => (
                        <MenuItem key={option.fingerprintId} value={option.fingerprintId}>
                          {option?.name} ({option.fingerprintId})
                        </MenuItem>
                      ))}
                    </Field.Select>

                    <Field.Password
                      disabled={!canEdit}
                      rules={{
                        required: {
                          value: true,
                          message: 'Payslip Password is required.',
                        },
                      }}
                      label="Payslip Password"
                      name="payslipPassword"
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
                ) : null}
              </Stack>
            )}
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
