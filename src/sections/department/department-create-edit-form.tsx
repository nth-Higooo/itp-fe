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
import { DepartmentRequest, departmentTypes } from 'src/data/employer/department.model';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { selectSelections } from 'src/redux/selections/selections.slice';
import {
  addDepartmentAsync,
  updateDepartmentAsync,
} from 'src/services/employer/department.service';
import { getAllDepartmentsAsync, getAllEmployeesAsync } from 'src/services/selection.service';

// ----------------------------------------------------------------------
export type TDepartmentCreateEditFormProps = {
  currentDepartment?: any;
  open: boolean;
  onClose?: any;
  fetchDataList: () => void;
};

export function DepartmentCreateEditForm({
  currentDepartment,
  open,
  onClose,
  fetchDataList,
}: TDepartmentCreateEditFormProps) {
  const dispatch = useAppDispatch();
  const { departments, getDepartmentStatus, employees, getEmployeeStatus } =
    useAppSelector(selectSelections);

  const methods = useForm({
    mode: 'all',
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (open) {
      if (currentDepartment) {
        reset({
          id: currentDepartment.id,
          name: currentDepartment.name,
          managerId: currentDepartment.manager?.id || '',
          orderNumber: currentDepartment.orderNumber,
          parentId: currentDepartment.parentId || '',
          type: currentDepartment.type || null,
        });
      } else {
        reset({
          id: null,
          name: '',
          managerId: '',
          orderNumber: null,
          parentId: '',
          type: null,
        });
      }
    }
  }, [currentDepartment, open, reset]);

  useEffect(() => {
    if (getDepartmentStatus === 'idle') {
      dispatch(getAllDepartmentsAsync());
    }
    if (getEmployeeStatus === 'idle') {
      dispatch(getAllEmployeesAsync());
    }
  }, []);

  useEffect(() => {
    if (open) {
      dispatch(getAllDepartmentsAsync());
      dispatch(getAllEmployeesAsync());
    }
  }, [open, dispatch]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload: DepartmentRequest = {
        ...data,
        name: data.name,
        orderNumber: data.orderNumber,
        parentId: data.parentId,
        managerId: data.managerId,
        type: data.type,
        childrenDepartment: [],
      };

      if (!data.id) {
        const response = await dispatch(addDepartmentAsync(payload));
        if (response.meta.requestStatus === 'fulfilled') {
          toast.success('Add department successfully!');
          fetchDataList();
          onClose();
        }
      } else {
        const response = await dispatch(updateDepartmentAsync(payload));
        if (response.meta.requestStatus === 'fulfilled') {
          toast.success('Update department successfully!');
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
        <DialogTitle>{currentDepartment ? 'Update Department' : 'Create Department'}</DialogTitle>

        <DialogContent>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(4, 1fr)',
            }}
            sx={{ mt: 1 }}
          >
            <Field.Text
              rules={{
                required: 'Department name is required.',
              }}
              name="name"
              label="Department name"
              sx={{ gridColumn: 'span 2' }}
            />

            <Field.Text
              rules={{
                required: 'Order number required.',
              }}
              name="orderNumber"
              label="Order Number"
            />
            <Field.Select
              name="type"
              label="Department Type"
              rules={{
                required: 'Type required.',
              }}
              InputLabelProps={{ shrink: true }}
            >
              {departmentTypes.map((value, id) => (
                <MenuItem key={id} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Field.Select>
          </Box>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            sx={{ mt: 3 }}
          >
            <Field.Select
              name="parentId"
              label="Parent Department"
              sx={{ gridColumn: 'span 1' }}
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem key={''} value={''}>
                None
              </MenuItem>
              {departments.map((option) => (
                <MenuItem key={option.name} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Select
              name="managerId"
              label="Department's Manager"
              InputLabelProps={{ shrink: true }}
            >
              {employees.map((option) => (
                <MenuItem key={option.fullName} value={option.id}>
                  {option.fullName}
                </MenuItem>
              ))}
            </Field.Select>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {currentDepartment ? 'Update' : 'Create'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
