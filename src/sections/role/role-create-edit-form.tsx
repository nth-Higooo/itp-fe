import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { Form, Field } from 'src/components/hook-form';
import { Role, RoleRequest } from 'src/data/auth/role.model';
import { useAppDispatch } from 'src/redux/store';
import { toast } from 'src/components/snackbar';
import { addRoleAsync, updateRoleAsync } from 'src/services/auth/role.service';

// ----------------------------------------------------------------------

export type TRoleCreateFormProps = {
  currentRole?: Role;
  open: boolean;
  onClose?: any;
};

export function RoleCreateEditForm({ currentRole, open, onClose }: TRoleCreateFormProps) {
  const dispatch = useAppDispatch();

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
      id: currentRole?.id || '',
      name: currentRole?.name || '',
      description: currentRole?.description || '',
    });
  }, [currentRole]);

  const onSubmit = handleSubmit(async (data: RoleRequest) => {
    try {
      if (!currentRole) {
        const response = await dispatch(addRoleAsync(data));
        if (response.meta.requestStatus === 'fulfilled') {
          toast.success('Add role successfully!');
          reset();
          onClose(true);
        }
      } else {
        const response = await dispatch(updateRoleAsync(data));
        if (response.meta.requestStatus === 'fulfilled') {
          toast.success('Update role successfully!');
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
      PaperProps={{ sx: { maxWidth: 500 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{currentRole ? 'Update Role' : 'Create Role'}</DialogTitle>

        <DialogContent>
          <Box rowGap={3} columnGap={2} display="grid" sx={{ mt: 1 }}>
            <Field.Text
              rules={{
                required: {
                  value: true,
                  message: 'Name is required.',
                },
              }}
              name="name"
              label="Name"
              disabled={currentRole?.name === 'Administrator' || currentRole?.name === 'Employee'}
            />

            <Field.Text name="description" label="Description" multiline rows={4} />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {currentRole ? 'Update' : 'Create'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
