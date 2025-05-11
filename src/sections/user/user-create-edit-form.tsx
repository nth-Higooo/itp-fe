import { useEffect, useMemo } from 'react';
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
import { useLocation } from 'react-router';
import styled from '@emotion/styled';
import { Chip, Typography } from '@mui/material';

// ----------------------------------------------------------------------
export const USER_STATUS_OPTIONS = [
  { value: UserStatus.ACTIVE, label: 'Active' },
  { value: UserStatus.PENDING, label: 'Pending' },
  { value: UserStatus.DISABLED, label: 'Disabled' },
];

export type TUserCreateEditFormProps = {
  currentUser?: any;
  open: boolean;
  onClose?: any;
};

export function UserCreateEditForm({ currentUser, open, onClose }: TUserCreateEditFormProps) {
  const dispatch = useAppDispatch();
  const { roles } = useAppSelector(selectSelections);
  const location = useLocation();
  const methods = useForm<any>({
    mode: 'all',
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = methods;

  const recommendedRoles = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const rolesFromUrl = searchParams.get('roles');
    return rolesFromUrl ? rolesFromUrl.split('|') : [];
  }, [location]);

  const roleOptions = useMemo(() => {
    return roles.map((role: Role) => ({
      ...role,
      isRecommended: recommendedRoles.includes(role.id),
    }));
  }, [roles, recommendedRoles]);

  useEffect(() => {
    const initialRoles = (currentUser?.roles || []).map((role: Role) => role.id);
    const recommendedRolesIds = roleOptions
      .filter((role) => role.isRecommended)
      .map((role) => role.id);

    reset({
      id: currentUser?.id || '',
      displayName: currentUser?.displayName || '',
      email: currentUser?.email || '',
      status: currentUser?.status || UserStatus.PENDING,
      roles: [...new Set([...initialRoles, ...recommendedRolesIds])],
    });
  }, [currentUser, roleOptions, reset]);

  const onSubmit = handleSubmit(async (data: any) => {
    try {
      const payload: UserRequest = {
        ...data,
        roles: data.roles.map((id: string) => {
          return roles.find((item: Role) => item.id === id);
        }) as Role[],
      };
      if (!currentUser) {
        const response = await dispatch(addUserAsync(payload));
        if (response.meta.requestStatus === 'fulfilled') {
          toast.success('Add user successfully!');
          reset();
          onClose(true);
        }
      } else {
        const response = await dispatch(updateUserAsync(payload));
        if (response.meta.requestStatus === 'fulfilled') {
          toast.success('Update user successfully!');
          reset();
          onClose(true);
        }
      }
    } catch (error) {
      console.error(error);
    }
  });

  // Add this function to handle adding a recommended role
  const handleAddRecommendedRole = (roleId: string) => {
    const currentRoles = watch('roles') || [];
    if (!currentRoles.includes(roleId)) {
      methods.setValue('roles', [...currentRoles, roleId]);
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{currentUser ? 'Update User' : 'Create User'}</DialogTitle>

        <DialogContent>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            sx={{ mt: 1 }}
          >
            <Field.Text
              rules={{
                required: {
                  value: true,
                  message: 'Email address is required.',
                },
                pattern: {
                  value: emailRegExp,
                  message: 'Please enter a valid email address.',
                },
              }}
              name="email"
              label="Email address"
            />
            <Field.Select
              rules={{
                required: 'Status is required.',
              }}
              name="status"
              label="Status"
              disabled={!currentUser}
            >
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
            <Field.Text
              rules={{
                required: 'Full name is required.',
              }}
              name="displayName"
              label="Full name"
            />
            <Field.MultiSelect
              rules={{
                required: 'Roles are required.',
              }}
              checkbox
              name="roles"
              label="Roles"
              options={roleOptions.map((role) => ({
                value: role.id,
                label: role.name,
              }))}
            />
            {recommendedRoles.length > 0 && (
              <Box mb={2} display="flex" alignItems="center" sx={{ gridColumn: 'span 2' }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  Recommended Roles:
                </Typography>
                <Box>
                  {roleOptions
                    .filter((role) => role.isRecommended)
                    .map((role) => (
                      <Chip
                        key={role.id}
                        label={role.name}
                        onClick={() => handleAddRecommendedRole(role.id)}
                        style={{ marginRight: '4px', fontSize: '0.875rem' }}
                      />
                    ))}
                </Box>
              </Box>
            )}
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
            {currentUser ? 'Update' : 'Create'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
