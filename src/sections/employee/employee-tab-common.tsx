import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { fData } from 'src/utils/format-number';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { CardHeader, Divider, MenuItem } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import {
  selectSelections,
  setDepartments,
  setPositions,
} from 'src/redux/selections/selections.slice';
import {
  getAllDepartmentsAsync,
  getAllPositionsLevels,
  getAllRolesAsync,
} from 'src/services/selection.service';
import { Role } from 'src/data/auth/role.model';
import {
  addEmployeeAsync,
  updateEmployeeAsync,
  uploadImage,
} from 'src/services/employee/employee.service';
import { emailRegExp } from 'src/utils';
import { GeneralInfo } from 'src/data/employee/onboarding.model';
import { EmployeeTabProps } from './employee-tab-general';
import { useRouter } from 'src/routes/hooks';
import dayjs from 'dayjs';
import { paths } from 'src/routes/paths';
import { Department } from 'src/data/employer/department.model';
import DepartmentSelect from './employee-department-select';
//-----------------------------------------------------------------------

export function EmployeeTabCommon({ currentEmployee, canEdit }: EmployeeTabProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    positions,
    getPositionsStatus,
    departments,
    getDepartmentStatus,
    roles,
    getAllRoleStatus,
  } = useAppSelector(selectSelections);

  const [selectedPositionId, setSelectedPositionId] = useState<string | undefined>(
    canEdit ? currentEmployee?.position?.parentId || '' : currentEmployee?.position?.id || ''
  );
  const [selectedDepartmentIds, setSelectedDepartmentIds] = useState<string[]>([]);

  useEffect(() => {
    if (currentEmployee?.departments) {
      const ids = currentEmployee.departments.map((department) => department.id);
      setSelectedDepartmentIds(ids);
    }
  }, [currentEmployee]);

  const handleDepartmentChange = (selectedDepartmentIds: string[]) => {
    setSelectedDepartmentIds(selectedDepartmentIds);
  };

  useEffect(() => {
    if (canEdit) {
      dispatch(getAllDepartmentsAsync());

      dispatch(getAllPositionsLevels());

      dispatch(getAllRolesAsync());
    } else {
      dispatch(setPositions(currentEmployee?.position ? [currentEmployee?.position] : []));
      dispatch(setDepartments(currentEmployee?.departments || []));
    }
  }, [dispatch]);

  const initialValues = {
    photo: currentEmployee?.photo || null,
    createUser: true,
    status: currentEmployee?.resignDate
      ? dayjs(currentEmployee.resignDate).isAfter(dayjs())
        ? 'ACTIVE'
        : 'RESIGN'
      : 'ACTIVE',
    fullName: currentEmployee?.fullName || '',
    email: currentEmployee?.user?.email || '',
    departmentIds: (currentEmployee?.departments || []).map((dept: Department) => dept.id),
    positionId: canEdit
      ? currentEmployee?.position?.parentId || ''
      : currentEmployee?.position?.id || '',
    recommendedRoleIds: currentEmployee?.recommendedRoleIds ?? [],
    levelId: currentEmployee?.position?.id || '',
    joinDate: currentEmployee?.joinDate || '',
  };

  useEffect(() => {
    reset(initialValues);
    setSelectedPositionId(currentEmployee?.position?.parentId);
  }, [currentEmployee]);

  const methods = useForm<any>({
    mode: 'all',
    defaultValues: initialValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data: GeneralInfo) => {
    try {
      let photo = '';
      if (typeof data.photo === 'object') {
        photo = await uploadImage(data.photo.file);
      }
      const payload = {
        id: currentEmployee?.id,
        ...data,
        positionId: data.levelId,
        departmentIds: selectedDepartmentIds,
        photo,
      };
      if (!currentEmployee?.id) {
        const response = await dispatch(addEmployeeAsync(payload));
        if (response.meta.requestStatus === 'fulfilled') {
          toast.success('Add employee successfully!');
          router.push(paths.employee.list);
        }
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
    reset();
  }, []);

  const onPositionChange = (event: any) => {
    const selectedId = event.target.value;
    setSelectedPositionId(selectedId);
    methods.setValue('positionId', selectedId);
  };

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Box sx={{ mb: 18 }}>
              <Field.UploadAvatar
                disabled={!canEdit}
                name="photo"
                maxSize={3145728}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {currentEmployee && canEdit && (
              <>
                <Divider sx={{ borderStyle: 'dashed' }} />
                <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                  <Button variant="contained" color="error">
                    Delete employee
                  </Button>
                </Stack>
              </>
            )}
          </Card>
        </Grid>

        <Grid xs={21} md={8}>
          <Card>
            <>
              {currentEmployee && <CardHeader title="Common" />}
              <Stack sx={{ p: 3 }}>
                <Box rowGap={2} columnGap={2} display="grid">
                  <Field.Text disabled={!canEdit} name="fullName" label="Full name" />
                  <Box
                    rowGap={2}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      lg: 'repeat(2, 1fr)',
                    }}
                  >
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
                      disabled={currentEmployee ? true : false}
                      name="email"
                      label="Email address"
                    />
                    <Field.DatePicker
                      rules={{ required: 'Join Date is required' }}
                      name="joinDate"
                      label="Join Date"
                    />
                  </Box>

                  <Box
                    rowGap={2}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      lg: 'repeat(2, 1fr)',
                    }}
                  >
                    <Field.Select
                      disabled={!canEdit}
                      name="positionId"
                      label="Position"
                      rules={{ required: 'Position is required.' }}
                      onChange={onPositionChange}
                    >
                      {positions.map((option: any) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Field.Select>

                    <Field.Select
                      name="levelId"
                      label="Level"
                      rules={{ required: 'Level is required.' }}
                      disabled={!selectedPositionId || !canEdit}
                    >
                      {selectedPositionId ? (
                        canEdit ? (
                          positions
                            .find((position: any) => position.id === selectedPositionId)
                            ?.levels?.map((level: any) => (
                              <MenuItem key={level.id} value={level.id}>
                                {level.level}
                              </MenuItem>
                            ))
                        ) : (
                          positions.map((level: any) => (
                            <MenuItem key={level.id} value={level.id}>
                              {level.level}
                            </MenuItem>
                          ))
                        )
                      ) : (
                        <MenuItem value="">No levels available</MenuItem>
                      )}
                    </Field.Select>
                  </Box>
                  <DepartmentSelect
                    departments={departments}
                    onChange={handleDepartmentChange}
                    selectedDepartmentIds={selectedDepartmentIds}
                    disabled={!canEdit}
                    name="Department"
                    label="Department"
                  />
                  {canEdit ? (
                    <Field.MultiSelect
                      name="recommendedRoleIds"
                      label="Recommended Roles"
                      checkbox
                      chip
                      options={roles
                        ?.filter((option: Role) => option.name !== 'Employee')
                        .map((option: Role) => ({
                          value: option.id,
                          label: option.name,
                        }))}
                    />
                  ) : (
                    <></>
                  )}
                </Box>
              </Stack>
              {canEdit ? (
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
            </>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
