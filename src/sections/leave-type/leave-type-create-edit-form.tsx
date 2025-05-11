import { useMemo } from 'react';
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
import { emailRegExp } from 'src/utils';
import { Stack } from '@mui/material';
import { useAppDispatch } from 'src/redux/store';
import { addLeaveTypeAsync, updateLeaveTypeAsync } from 'src/services/leave/leave.service';

// ----------------------------------------------------------------------
export type TLeaveTypeCreateEditFormProps = {
  resetFunction?: any;
  currentLeaveType?: any;
  open: boolean;
  onClose?: any;
};

export function LeaveTypeCreateEditForm({
  resetFunction,
  currentLeaveType,
  open,
  onClose,
}: TLeaveTypeCreateEditFormProps) {
  const dispatch = useAppDispatch();
  const defaultValues = useMemo(
    () => ({
      name: currentLeaveType?.name || '',
      regulationQuantity: currentLeaveType?.regulationQuantity || '',
      orderNumber: currentLeaveType?.orderNumber || '',
      id: currentLeaveType?.id,
    }),
    [currentLeaveType]
  );

  const methods = useForm({
    mode: 'all',
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentLeaveType) {
        await dispatch(updateLeaveTypeAsync(data));
        toast.success('Update leave type successfully!');
        reset();
        resetFunction();
        onClose();
      } else {
        await dispatch(addLeaveTypeAsync(data));
        toast.success('Add leave type successfully!');
        reset();
        resetFunction();
        onClose();
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
        <DialogTitle>{currentLeaveType ? 'Update Leave' : 'Create Leave'}</DialogTitle>

        <DialogContent>
          <Stack gap={5} sx={{ mt: 1 }}>
            <Box display="flex" justifyContent="space-between">
              <Box sx={{ width: '75%' }}>
                <Field.Text 
                required 
                name="name" 
                label="Leave Type Name" 
                rules={{ required: 'Leave Type Name is required' }}
                />
              </Box>
              <Box sx={{ width: '20%' }}>
                <Field.Text
                  inputMode="numeric"
                  rules={{ required: 'Order Number is required' }}
                  required
                  name="orderNumber"
                  label="Order Number"
                  type="number"
                />
              </Box>
            </Box>
            <Field.Text required 
            name="regulationQuantity" 
            label="Legal Regulation Quantity"
            rules={{ required: 'Regulation Quantity is required' }}
            type="number"
             />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {currentLeaveType ? 'Update' : 'Create'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
