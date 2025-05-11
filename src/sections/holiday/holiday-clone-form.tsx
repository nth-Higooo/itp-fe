import { useForm } from 'react-hook-form';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { useAppDispatch } from 'src/redux/store';
import { cloneHolidayAsync } from 'src/services/holiday/holiday.service';
import { cloneYear } from 'src/data/holiday/holiday.model';
import { MenuItem } from '@mui/material';

// ----------------------------------------------------------------------
export type THolidayCreateFormProps = {
  open: boolean;
  onClose?: any;
  fetchDataList: () => void;
};

export function HolidayCloneForm({ open, onClose, fetchDataList }: THolidayCreateFormProps) {
  const dispatch = useAppDispatch();

  const methods = useForm<any>({
    mode: 'all',
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload: cloneYear = {
        ...data,
        year: data.year,
      };
      const response = await dispatch(cloneHolidayAsync(payload));
      if (response.meta.requestStatus === 'fulfilled') {
        toast.success('Add holiday successfully!');
        fetchDataList();
        onClose(true);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while cloning the holiday.');
    }
  });
  const currentYear = new Date().getFullYear() + 1;
  const years = Array.from({ length: 21 }, (_, i) => currentYear + i).map((year) => ({
    id: year,
    name: year.toString(),
  }));

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={() => {
        onClose();
      }}
      PaperProps={{ sx: { maxWidth: 320 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{'Clone Holiday'}</DialogTitle>
        <DialogContent>
          <Field.Select
            sx={{ mt: 2 }}
            rules={{
              required: 'Year is required.',
            }}
            name="year"
            label="Year"
          >
            {years.map((year) => (
              <MenuItem key={year.id} value={year.name}>
                {year.name}
              </MenuItem>
            ))}
          </Field.Select>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {'Clone'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
