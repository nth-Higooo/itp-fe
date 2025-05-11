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

import { Form, Field } from 'src/components/hook-form';
import { emailRegExp } from 'src/utils';
import { Role } from 'src/data/auth/role.model';
import { UserRequest, UserStatus } from 'src/data/auth/user.model';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { selectSelections } from 'src/redux/selections/selections.slice';
import { addUserAsync, updateUserAsync } from 'src/services/auth/user.service';
import { toast } from 'src/components/snackbar';
import {
  NotificationGroup,
  NotificationGroupMember,
  NotificationGroupType,
} from 'src/data/notification-group/notification-group.model';
import { selectEmployees } from 'src/redux/employee/employees.slice';
import { Approver } from 'src/data/employee/employee.model';
import { selectNotificationGroups } from 'src/redux/notification-group/notification-group.slice';
import {
  addNotificationGroupAsync,
  updateNotificationGroupAsync,
} from 'src/services/notification-group/notification-group.service';

// ----------------------------------------------------------------------

export const NOTIFICATION_GROUP_OPTIONS = [
  { value: NotificationGroupType.EMPLOYEE_CHANGE_REQUEST, label: 'Employee Change Request' },
  { value: NotificationGroupType.BIRTHDAY, label: 'Birthday' },
  { value: NotificationGroupType.CONTRACT, label: 'Contract' },
  { value: NotificationGroupType.OTHER, label: 'Other' },
];

// ----------------------------------------------------------------------

export type TNotificationGroupCreateEditFormProps = {
  currentNotificationGroup?: NotificationGroup;
  open: boolean;
  onClose?: any;
};

export function NotificationGroupCreateEditForm({
  currentNotificationGroup,
  open,
  onClose,
}: TNotificationGroupCreateEditFormProps) {
  const dispatch = useAppDispatch();
  const { members } = useAppSelector(selectNotificationGroups);

  const methods = useForm<any>({
    mode: 'all',
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset({
      id: currentNotificationGroup?.id || '',
      type: currentNotificationGroup?.type || '',
      members: (currentNotificationGroup?.members || []).map((m) => m.id),
    });
  }, [currentNotificationGroup]);

  const onSubmit = handleSubmit(async (data: any) => {
    try {
      if (!currentNotificationGroup) {
        const response = await dispatch(addNotificationGroupAsync(data));
        if (response.meta.requestStatus === 'fulfilled') {
          toast.success('Add notification group successfully!');
          reset();
          onClose(true);
        }
      } else {
        const response = await dispatch(updateNotificationGroupAsync(data));
        if (response.meta.requestStatus === 'fulfilled') {
          toast.success('Update notification group successfully!');
          reset();
          onClose(true);
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
        <DialogTitle>
          {currentNotificationGroup ? 'Update Notification Group' : 'Create Notification Group'}
        </DialogTitle>

        <DialogContent>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            sx={{ mt: 1 }}
          >
            <Field.Select
              rules={{
                required: 'type is required.',
              }}
              name="type"
              label="Type"
            >
              {NOTIFICATION_GROUP_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.MultiSelect
              rules={{
                required: 'Members are required.',
              }}
              checkbox
              name="members"
              label="Members"
              options={members?.map((item: NotificationGroupMember) => ({
                value: item.id,
                label: item.fullName,
              }))}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              onClose(false);
            }}
          >
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {currentNotificationGroup ? 'Update' : 'Create'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
