import { Helmet } from 'react-helmet-async';

import { useParams, useRouter } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { _userList } from 'src/_mock/_user';

import { useEffect, useMemo, useState } from 'react';
import {
  approveChangeRequestAsync,
  getEmployeeInfoAsync,
  rejectChangeRequestAsync,
} from 'src/services/employee/employee.service';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { selectEmployees } from 'src/redux/employee/employees.slice';
import { useForm } from 'react-hook-form';
import { toast } from 'src/components/snackbar';
import {
  EmployeeChangeRequest,
  genders,
  maritalStatus,
  OnboardingEmployee,
} from 'src/data/employee/onboarding.model';
import { Field, Form } from 'src/components/hook-form';
import { Box, Button, Card, CardHeader, MenuItem, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { DashboardContent } from 'src/layouts/dashboard';
import { EmployeeTabCommon } from 'src/sections/employee/employee-tab-common';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import dayjs from 'dayjs';
import { Iconify } from 'src/components/iconify';
// ----------------------------------------------------------------------

const metadata = { title: `Employee change request | ${CONFIG.appName}` };

const hightLightStyle = {
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#FF3030 !important',
  },
  '& .MuiOutlinedInput-input': {
    color: '#FF3030 !important',
    textFillColor: '#FF3030 !important',
  },
  '& .MuiInputLabel-root': {
    color: '#FF3030 !important',
  },
  '& .MuiFormHelperText-root': {
    color: '#FF3030 !important',
  },
};

export default function Page() {
  const { id = '' } = useParams();
  const dispatch = useAppDispatch();
  const { detailEmployee } = useAppSelector(selectEmployees);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      dispatch(getEmployeeInfoAsync(id));
    }
  }, [dispatch, id]);

  const currentEmployee = useMemo(
    () => ({
      ...detailEmployee,
      ...detailEmployee?.changedInformation,
    }),
    [detailEmployee]
  );

  const [fieldsChanged, setFieldsChanged] = useState<string[]>([]);

  useEffect(() => {
    if (!detailEmployee?.changedInformation) return;

    let fieldsChanged: string[] = [];
    for (const key of Object.keys(detailEmployee.changedInformation)) {
      if (key in detailEmployee) {
        console.log(
          detailEmployee[key as keyof OnboardingEmployee],
          detailEmployee.changedInformation[key as keyof EmployeeChangeRequest]
        );

        if (
          !detailEmployee[key as keyof OnboardingEmployee] &&
          !detailEmployee.changedInformation[key as keyof EmployeeChangeRequest]
        ) {
          continue;
        }

        if (
          detailEmployee[key as keyof OnboardingEmployee] !==
          detailEmployee.changedInformation[key as keyof EmployeeChangeRequest]
        ) {
          fieldsChanged = [...fieldsChanged, key];
        }
      }
    }
    setFieldsChanged(fieldsChanged);
  }, [detailEmployee]);

  const defaultValues = useMemo(
    () => ({
      personalEmail: currentEmployee?.personalEmail || '',
      phoneNumber: currentEmployee?.phoneNumber || '',
      gender: currentEmployee?.gender || '',
      dateOfBirth: currentEmployee?.dateOfBirth || '',
      maritalStatus: currentEmployee?.maritalStatus || '',
      contactAddress: currentEmployee?.contactAddress || '',
      permanentAddress: currentEmployee?.permanentAddress || '',
      vneIDNo: currentEmployee?.vneIDNo || '',
      vneIDDate: currentEmployee?.vneIDDate || '',
      vneIDPlace: currentEmployee?.vneIDPlace || '',
      pitNo: currentEmployee?.pitNo || '',
      siNo: currentEmployee?.siNo || '',
      bankName: currentEmployee?.bankName || '',
      bankBranch: currentEmployee?.bankBranch || '',
      bankAccountName: currentEmployee?.bankAccountName || '',
      bankAccountNumber: currentEmployee?.bankAccountNumber || '',
      ecRelationship: currentEmployee?.ecRelationship || '',
      ecName: currentEmployee?.ecName || '',
      ecPhoneNumber: currentEmployee?.ecPhoneNumber || '',
      fingerprintId: currentEmployee?.fingerprintId || '',
      payslipPassword: currentEmployee?.payslipPassword || '',
      joinDate: currentEmployee?.joinDate || '',
      resignDate: currentEmployee?.resignDate || '',
      leaveDate: currentEmployee?.leaveDate || '',
      resignReason: currentEmployee?.resignReason || '',
    }),
    [currentEmployee]
  );

  const methods = useForm<EmployeeChangeRequest>({
    mode: 'onSubmit',
    defaultValues: defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const onReject = async () => {
    try {
      const payload = {
        id: currentEmployee.id,
        ...getValues(),
      };

      const response = await dispatch(rejectChangeRequestAsync(payload));
      if (response.meta.requestStatus === 'fulfilled') {
        toast.success('Reject employee change information successfully!');
        router.push(paths.employee.list);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async () => {
    try {
      const payload = {
        id: currentEmployee.id,
        ...getValues(),
      };

      const response = await dispatch(approveChangeRequestAsync(payload));
      if (response.meta.requestStatus === 'fulfilled') {
        toast.success('Approve employee change information successfully!');
        router.push(paths.employee.list);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    reset(defaultValues as any);
  }, [currentEmployee]);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Employee change request"
          action={
            <Box gap={2} display="flex">
              <Button
                startIcon={<Iconify icon="fluent:text-change-reject-24-regular" />}
                variant="contained"
                onClick={() => onReject()}
              >
                Reject
              </Button>
              <Button
                startIcon={<Iconify icon="material-symbols:order-approve-outline" />}
                onClick={() => onSubmit()}
                variant="contained"
                color="primary"
              >
                Approve
              </Button>
            </Box>
          }
        />

        <Box display="flex" gap={5} flexDirection="column">
          <EmployeeTabCommon currentEmployee={currentEmployee} canEdit={false} />

          <Form methods={methods}>
            <Grid container spacing={3}>
              <Grid xs={12}>
                <Card>
                  <CardHeader title="Employee Details" />
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
                        disabled
                        label="Personal Email"
                        name="personalEmail"
                        sx={fieldsChanged.includes('personalEmail') ? hightLightStyle : {}}
                        helperText={
                          fieldsChanged.includes('personalEmail')
                            ? `Current value is "${detailEmployee?.personalEmail}"`
                            : ''
                        }
                      />
                      <Field.Text
                        disabled
                        label="Phone Number"
                        name="phoneNumber"
                        sx={fieldsChanged.includes('phoneNumber') ? hightLightStyle : {}}
                        helperText={
                          fieldsChanged.includes('phoneNumber')
                            ? `Current value is "${detailEmployee?.phoneNumber}"`
                            : ''
                        }
                      />

                      <Field.Select
                        disabled
                        name="gender"
                        label="Gender"
                        sx={
                          fieldsChanged.includes('gender')
                            ? { ...hightLightStyle, height: '2.75rem' }
                            : { height: '2.75rem' }
                        }
                        helperText={
                          fieldsChanged.includes('gender')
                            ? `Current value is "${detailEmployee?.gender}"`
                            : ''
                        }
                      >
                        {genders.map((status, index) => (
                          <MenuItem key={index} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </Field.Select>

                      <Field.Select
                        disabled
                        name="maritalStatus"
                        label="Marital Status"
                        sx={
                          fieldsChanged.includes('maritalStatus')
                            ? { ...hightLightStyle, height: '2.75rem' }
                            : { height: '2.75rem' }
                        }
                        helperText={
                          fieldsChanged.includes('maritalStatus')
                            ? `Current value is "${detailEmployee?.maritalStatus}"`
                            : ''
                        }
                      >
                        {maritalStatus.map((status, index) => (
                          <MenuItem key={index} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </Field.Select>

                      <Field.DatePicker
                        disabled
                        name="dateOfBirth"
                        label="Date of Birth"
                        defaultValue={null}
                        sx={fieldsChanged.includes('dateOfBirth') ? hightLightStyle : {}}
                        slotProps={{
                          textField: {
                            helperText: fieldsChanged.includes('dateOfBirth')
                              ? `Current value is "${dayjs(detailEmployee?.dateOfBirth).format('DD/MM/YYYY')}"`
                              : '',
                          },
                        }}
                      />

                      <Field.Text
                        disabled
                        label="Contact Address"
                        name="contactAddress"
                        sx={fieldsChanged.includes('contactAddress') ? hightLightStyle : {}}
                        helperText={
                          fieldsChanged.includes('contactAddress')
                            ? `Current value is "${detailEmployee?.contactAddress}"`
                            : ''
                        }
                      />

                      <Field.Text
                        disabled
                        label="Permanent Address"
                        name="permanentAddress"
                        sx={fieldsChanged.includes('permanentAddress') ? hightLightStyle : {}}
                        helperText={
                          fieldsChanged.includes('permanentAddress')
                            ? `Current value is "${detailEmployee?.permanentAddress}"`
                            : ''
                        }
                      />
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid xs={12}>
                <Card>
                  <CardHeader title="Government" />
                  <Stack sx={{ p: 3 }}>
                    <Box
                      rowGap={3}
                      columnGap={2}
                      display="grid"
                      gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                      }}
                    >
                      <Field.Text
                        disabled
                        label="VNeID No"
                        name="vneIDNo"
                        sx={fieldsChanged.includes('vneIDNo') ? hightLightStyle : {}}
                        helperText={
                          fieldsChanged.includes('vneIDNo')
                            ? `Current value is "${detailEmployee?.vneIDNo}"`
                            : ''
                        }
                      />
                      <Field.DatePicker
                        disabled
                        name="vneIDDate"
                        label="VNeID Issue Date"
                        sx={fieldsChanged.includes('vneIDDate') ? hightLightStyle : {}}
                        slotProps={{
                          textField: {
                            helperText: fieldsChanged.includes('vneIDDate')
                              ? `Current value is "${dayjs(detailEmployee?.vneIDDate).format('DD/MM/YYYY')}"`
                              : '',
                          },
                        }}
                      />

                      <Field.Text
                        disabled
                        label="VNeID Place"
                        name="vneIDPlace"
                        sx={fieldsChanged.includes('vneIDPlace') ? hightLightStyle : {}}
                        helperText={
                          fieldsChanged.includes('vneIDPlace')
                            ? `Current value is "${detailEmployee?.vneIDPlace}"`
                            : ''
                        }
                      />
                      <Field.Text
                        disabled
                        label="PIT No"
                        name="pitNo"
                        sx={fieldsChanged.includes('pitNo') ? hightLightStyle : {}}
                        helperText={
                          fieldsChanged.includes('pitNo')
                            ? `Current value is "${detailEmployee?.pitNo}"`
                            : ''
                        }
                      />

                      <Field.Text
                        disabled
                        label="SI No"
                        name="siNo"
                        sx={fieldsChanged.includes('siNo') ? hightLightStyle : {}}
                        helperText={
                          fieldsChanged.includes('siNo')
                            ? `Current value is "${detailEmployee?.siNo}"`
                            : ''
                        }
                      />
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid xs={12}>
                <Card>
                  <CardHeader title="Bank Information" />
                  <Stack sx={{ p: 3 }}>
                    <Box
                      rowGap={3}
                      columnGap={2}
                      display="grid"
                      gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                      }}
                    >
                      <Field.Text
                        disabled
                        name="bankName"
                        label="Bank name"
                        sx={fieldsChanged.includes('bankName') ? hightLightStyle : {}}
                        helperText={
                          fieldsChanged.includes('bankName')
                            ? `Current value is "${detailEmployee?.bankName}"`
                            : ''
                        }
                      />
                      <Field.Text
                        disabled
                        name="bankBranch"
                        label="Bank branch"
                        sx={fieldsChanged.includes('bankBranch') ? hightLightStyle : {}}
                        helperText={
                          fieldsChanged.includes('bankBranch')
                            ? `Current value is "${detailEmployee?.bankBranch}"`
                            : ''
                        }
                      />

                      <Field.Text
                        disabled
                        name="bankAccountName"
                        label="Bank account name"
                        sx={fieldsChanged.includes('bankAccountName') ? hightLightStyle : {}}
                        helperText={
                          fieldsChanged.includes('bankAccountName')
                            ? `Current value is "${detailEmployee?.bankAccountName}"`
                            : ''
                        }
                      />

                      <Field.Text
                        disabled
                        name="bankAccountNumber"
                        label="Bank account number"
                        sx={fieldsChanged.includes('bankAccountNumber') ? hightLightStyle : {}}
                        helperText={
                          fieldsChanged.includes('bankAccountNumber')
                            ? `Current value is "${detailEmployee?.bankAccountNumber}"`
                            : ''
                        }
                      />
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid xs={12}>
                <Card>
                  <CardHeader title="Emergency Contact" />
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
                        disabled
                        label="Relationship"
                        name="ecRelationship"
                        sx={fieldsChanged.includes('ecRelationship') ? hightLightStyle : {}}
                        helperText={
                          fieldsChanged.includes('ecRelationship')
                            ? `Current value is "${detailEmployee?.ecRelationship}"`
                            : ''
                        }
                      />
                      <Field.Text
                        disabled
                        label="Full Name"
                        name="ecName"
                        sx={fieldsChanged.includes('ecName') ? hightLightStyle : {}}
                        helperText={
                          fieldsChanged.includes('ecName')
                            ? `Current value is "${detailEmployee?.ecName}"`
                            : ''
                        }
                      />
                      <Field.Text
                        disabled
                        label="Phone Number"
                        name="ecPhoneNumber"
                        sx={fieldsChanged.includes('ecPhoneNumber') ? hightLightStyle : {}}
                        helperText={
                          fieldsChanged.includes('ecPhoneNumber')
                            ? `Current value is "${detailEmployee?.ecPhoneNumber}"`
                            : ''
                        }
                      />
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid xs={12}>
                <Card>
                  <CardHeader title="Others" />
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
                      <Field.DatePicker
                        disabled
                        rules={{ required: 'Join Date is required' }}
                        name="joinDate"
                        label="Join Date"
                        sx={fieldsChanged.includes('joinDate') ? hightLightStyle : {}}
                        slotProps={{
                          textField: {
                            helperText: fieldsChanged.includes('joinDate')
                              ? `Current value is "${dayjs(detailEmployee?.joinDate).format('DD/MM/YYYY')}"`
                              : '',
                          },
                        }}
                      />

                      <Field.DatePicker
                        disabled
                        name="resignDate"
                        label="Resign Date"
                        sx={fieldsChanged.includes('resignDate') ? hightLightStyle : {}}
                        slotProps={{
                          textField: {
                            helperText: fieldsChanged.includes('resignDate')
                              ? `Current value is "${dayjs(detailEmployee?.resignDate).format('DD/MM/YYYY')}"`
                              : '',
                          },
                        }}
                      />

                      <Field.DatePicker
                        disabled
                        name="leaveDate"
                        label="Leave Date"
                        sx={fieldsChanged.includes('leaveDate') ? hightLightStyle : {}}
                        slotProps={{
                          textField: {
                            helperText: fieldsChanged.includes('leaveDate')
                              ? `Current value is "${dayjs(detailEmployee?.leaveDate).format('DD/MM/YYYY')}"`
                              : '',
                          },
                        }}
                      />

                      <Field.Text
                        disabled
                        label="Resign Reason"
                        name="resignReason"
                        sx={fieldsChanged.includes('resignReason') ? hightLightStyle : {}}
                        helperText={
                          fieldsChanged.includes('resignReason')
                            ? `Current value is "${detailEmployee?.resignReason}"`
                            : ''
                        }
                      />
                      <Field.Text
                        disabled
                        label="Fingerprint Id"
                        name="fingerprintId"
                        sx={fieldsChanged.includes('fingerprintId') ? hightLightStyle : {}}
                        helperText={
                          fieldsChanged.includes('fingerprintId')
                            ? `Current value is "${detailEmployee?.fingerprintId}"`
                            : ''
                        }
                      />

                      <Field.Password
                        disabled
                        label="Payslip Password"
                        name="payslipPassword"
                        sx={fieldsChanged.includes('payslipPassword') ? hightLightStyle : {}}
                        helperText={
                          fieldsChanged.includes('payslipPassword')
                            ? `Current value is "${detailEmployee?.payslipPassword}"`
                            : ''
                        }
                      ></Field.Password>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Form>
        </Box>
      </DashboardContent>
    </>
  );
}
