import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { useAppDispatch } from 'src/redux/store';
import { addDegreeAsync, updateDegreeAsync } from 'src/services/Degree/degree.service';
import { Degree } from 'src/data/employee/employee.model';

// ----------------------------------------------------------------------
export type TCreateEditFormProps = {
  currentDegree?: any;
  open: boolean;
  onClose: () => void;
  fetchDataList: () => void;
};

export function DegreeCreateEditForm({
  currentDegree,
  open,
  onClose,
  fetchDataList,
}: TCreateEditFormProps) {
  const dispatch = useAppDispatch();

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
      if (currentDegree) {
        reset({
          id: currentDegree?.id || '',
          name: currentDegree?.name || '',
        });
      } else {
        reset({
          id: '',
          name: '',
        });
      }
    }
  }, [currentDegree, open, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload: Degree = {
        ...data,
        name: data.name,
      };

      if (!data.id) {
        const response = await dispatch(addDegreeAsync(payload));
        if (response.meta.requestStatus === 'fulfilled') {
          toast.success('Add degree successfully!');
          reset();
          fetchDataList();
          onClose();
        }
      } else {
        const response = await dispatch(updateDegreeAsync(payload));
        if (response.meta.requestStatus === 'fulfilled') {
          toast.success('Update degree successfully!');
          reset();
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
        <DialogTitle>{currentDegree ? 'Update Degree' : 'Create Degree'}</DialogTitle>

        <DialogContent>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)' }}
            sx={{ mt: 1 }}
          >
            <Field.Text
              rules={{
                required: 'Degree name is required.',
              }}
              name="name"
              label="Degree name"
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {currentDegree ? 'Update' : 'Create'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
