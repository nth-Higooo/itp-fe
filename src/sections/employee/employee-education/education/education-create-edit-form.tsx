import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { EmployeeEducations } from 'src/data/employee/employee.model';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import {
  addEmployeeEducationsAsync,
  updateEmployeeEducationsAsync,
} from 'src/services/employee/employee.service';
import { selectDegrees } from 'src/redux/employer/degree.slice';
import { selectSelections } from 'src/redux/selections/selections.slice';
import { getDegreesAsync } from 'src/services/Degree/degree.service';

// ----------------------------------------------------------------------

export type TEducationCreateEditFormProps = {
  currentEducation?: EmployeeEducations;
  open: boolean;
  onClose?: () => void;
  fetchDataList: () => void;
  employeeId: string;
};

export function EducationCreateEditForm({
  employeeId,
  currentEducation,
  open,
  onClose = () => {},
  fetchDataList,
}: TEducationCreateEditFormProps) {
  const dispatch = useAppDispatch();
  const { degrees, getDegreesStatus } = useAppSelector(selectSelections);
  const methods = useForm({
    mode: 'all',
  });

  const {
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;
  const fromYear = watch('fromYear');

  useEffect(() => {
    reset({
      id: currentEducation?.id || null,
      school: currentEducation?.school || '',
      major: currentEducation?.major || '',
      toYear: currentEducation?.toYear || null,
      fromYear: currentEducation?.fromYear || null,
      degreeId: currentEducation?.degree?.id || null,
    });
  }, [currentEducation, reset]);

  useEffect(() => {
    if (getDegreesStatus === 'idle') {
      dispatch(getDegreesAsync());
    }
  }, [getDegreesStatus, dispatch]);

  const onSubmit = handleSubmit(async (data: EmployeeEducations) => {
    try {
      const payload: EmployeeEducations = {
        ...data,
        employeeId: employeeId,
        school: data.school,
        major: data.major,
        toYear: data.toYear,
        fromYear: data.fromYear,
        degreeId: data.degreeId,
      };

      if (!data.id) {
        const response = await dispatch(addEmployeeEducationsAsync(payload));
        if (response.meta.requestStatus === 'fulfilled') {
          toast.success('Education added successfully!');
          fetchDataList();
          onClose();
        }
      } else {
        const response = await dispatch(updateEmployeeEducationsAsync(payload));
        if (response.meta.requestStatus === 'fulfilled') {
          toast.success('Education updated successfully!');
          fetchDataList();
          onClose();
        }
      }
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{currentEducation ? 'Update Education' : 'Create Education'}</DialogTitle>

        <DialogContent>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            }}
            sx={{ mt: 1 }}
          >
            <Field.Text
              rules={{
                required: 'School name is required.',
              }}
              name="school"
              label="School Name"
              sx={{ gridColumn: 'span 3' }}
            />
            <Field.Select
              name="degreeId"
              label="Degree"
              rules={{ required: 'Degree is required.' }}
            >
              {degrees.map((option: any) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </Field.Select>
            <Field.Text
              rules={{
                required: 'Major is required.',
              }}
              name="major"
              label="Major"
              sx={{ gridColumn: 'span 2' }}
            />
            <Field.Text
              name="fromYear"
              label="From Year"
              type="number"
              rules={{
                required: 'From Year is required.',
              }}
            />
            <Field.Text
              name="toYear"
              label="To Year"
              type="number"
              rules={{
                required: 'To Year is required.',
                validate: (value: any) =>
                  !fromYear ||
                  parseInt(value, 10) > parseInt(fromYear, 10) ||
                  'To Year must be after From Year.',
              }}
            />
          </Box>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            sx={{ mt: 3 }}
          ></Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {currentEducation ? 'Update' : 'Create'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
