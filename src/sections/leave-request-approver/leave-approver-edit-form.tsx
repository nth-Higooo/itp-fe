import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { _roles } from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { Box, MenuItem, Stack } from '@mui/material';
import { useAppDispatch } from 'src/redux/store';
import { approveLeave } from 'src/data/leave/leave.model';
import { updateLeaveRequestApproverAsync } from 'src/services/leave/leave.service';
import dayjs from 'dayjs';
import { useBoolean } from 'src/hooks/use-boolean';

// ----------------------------------------------------------------------
export type TLeaveApproverEditFormProps = {
  currentRequest?: any;
  open: boolean;
  onClose?: any;
  onRefresh?: any;
  canViewDays?: boolean;
};

export function LeaveApproverEditForm({
  currentRequest,
  open,
  onClose,
  onRefresh,
  canViewDays,
}: TLeaveApproverEditFormProps) {
  const dispatch = useAppDispatch();

  const canEdit = useBoolean(true);

  useEffect(() => {
    if (currentRequest.status === 'Pending') {
      canEdit.onFalse();
    } else {
      canEdit.onTrue();
    }
  }, [currentRequest.status]);

  const defaultValues = useMemo(
    () => ({
      name: currentRequest?.employee.fullName,
      reason: currentRequest?.reason || '',
      id: currentRequest?.id,
      status: currentRequest?.status,
      comment: currentRequest?.comment,
      startDate: currentRequest?.startDate || '',
      endDate: currentRequest?.endDate || '',
      numberOfDays: currentRequest?.numberOfDays || '',
    }),
    [currentRequest]
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

  const onSubmit = handleSubmit(async (data: approveLeave) => {
    let Data = {
      id: currentRequest.id,
      status: data.status,
      comment: data.comment,
    };
    try {
      const response = await dispatch(updateLeaveRequestApproverAsync(Data));
      if (response.meta.requestStatus === 'fulfilled') {
        toast.success('Leave request updated successfully');
        onRefresh();
      }
      onClose();
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
      PaperProps={{ sx: { maxWidth: 520 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{'Update Leave Request Status'}</DialogTitle>

        <DialogContent>
          <Stack gap={5} sx={{ mt: 1, mb: 5 }}>
            {canViewDays && (
              <Stack gap={5} alignItems={{ xs: 'flex-end', md: 'center' }} direction="column">
                <Field.Text
                  name="name"
                  label="Name"
                  value={currentRequest?.employee.fullName}
                  disabled
                />
                <Box
                  sx={{
                    display: 'flex',
                    width: '100%',
                    gap: 5,
                  }}
                >
                  <Field.Text
                    name="startDate"
                    label="Start Date"
                    value={dayjs(currentRequest?.startDate).format('DD/MM/YYYY')}
                    disabled
                  />
                  <Field.Text
                    name="endDate"
                    label="End Date"
                    value={dayjs(currentRequest?.endDate).format('DD/MM/YYYY')}
                    disabled
                  />
                  <Field.Text
                    name="numberOfDays"
                    label="Number of Days"
                    value={currentRequest?.numberOfDays}
                    disabled
                  />
                </Box>
                <Field.Text
                  name="reason"
                  label="Reason"
                  value={currentRequest?.reason}
                  disabled
                  multiline
                  minRows="2"
                  sx={{ width: '100%' }}
                />
              </Stack>
            )}
            <Stack
              spacing={2}
              alignItems={{ xs: 'flex-end', md: 'center' }}
              direction={{ xs: 'column', md: 'row' }}
            >
              {currentRequest.status === 'Pending' ? (
                <Field.Select
                  name="status"
                  defaultValue={''}
                  label="Status"
                  rules={{ required: 'Status is required.' }}
                  value={currentRequest?.status || ''}
                  disabled={canEdit.value}
                >
                  <MenuItem value="">Select request status</MenuItem>
                  <MenuItem value="Approved">Approve</MenuItem>
                  <MenuItem value="Rejected">Reject</MenuItem>
                </Field.Select>
              ) : (
                <Field.Text name="status" label="Status" value={currentRequest?.status} disabled />
              )}
            </Stack>
            <Stack
              spacing={2}
              alignItems={{ xs: 'flex-end', md: 'center' }}
              direction={{ xs: 'column', md: 'row' }}
            >
              <Field.Text
                name="comment"
                label="Comment"
                sx={{ flexGrow: 1 }}
                value={currentRequest?.comment || null}
                disabled={canEdit.value}
              />
            </Stack>
          </Stack>
        </DialogContent>
        {currentRequest.status === 'Pending' && (
          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => {
                onClose();
                reset();
              }}
            >
              Cancel
            </Button>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {'Update'}
            </LoadingButton>
          </DialogActions>
        )}
      </Form>
    </Dialog>
  );
}
