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
import { EmployeeEducations } from 'src/data/employee/employee.model';
import { useAppDispatch } from 'src/redux/store';
import {
  addEmployeeEducationsAsync,
  updateEmployeeEducationsAsync,
} from 'src/services/employee/employee.service';

// ----------------------------------------------------------------------

export type TCertificateCreateEditFormProps = {
  currentCertificate?: EmployeeEducations;
  open: boolean;
  onClose?: () => void;
  fetchDataList: () => void;
  employeeId: string;
};

export function CertificateCreateEditForm({
  currentCertificate,
  open,
  onClose = () => {},
  fetchDataList,
  employeeId,
}: TCertificateCreateEditFormProps) {
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
    reset({
      id: currentCertificate?.id || null,
      certificateName: currentCertificate?.certificateName || '',
      certificateWebsite: currentCertificate?.certificateWebsite || '',
      toYear: currentCertificate?.toYear || null,
    });
  }, [currentCertificate, reset]);

  const onSubmit = handleSubmit(async (data: EmployeeEducations) => {
    try {
      const payload: EmployeeEducations = {
        ...data,
        employeeId: employeeId,
        certificateName: data.certificateName,
        certificateWebsite: data.certificateWebsite,
        toYear: data.toYear,
      };

      if (!data.id) {
        const response = await dispatch(addEmployeeEducationsAsync(payload));
        if (response.meta.requestStatus === 'fulfilled') {
          toast.success('Certificate added successfully!');
          fetchDataList();
          onClose();
        }
      } else {
        const response = await dispatch(updateEmployeeEducationsAsync(payload));
        if (response.meta.requestStatus === 'fulfilled') {
          toast.success('Certificate updated successfully!');
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
        <DialogTitle>
          {currentCertificate ? 'Update Certificate' : 'Create Certificate'}
        </DialogTitle>

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
                required: 'Certificate website is required.',
              }}
              name="certificateWebsite"
              label="Certificate Website"
            />
          </Box>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            sx={{ mt: 3 }}
          >
            <Field.Text
              rules={{
                required: 'Certificate name is required.',
              }}
              name="certificateName"
              label="Certificate Name"
            />
            <Field.Text name="toYear" label="Year of Completion" type="number" />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {currentCertificate ? 'Update' : 'Create'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
