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
import { addHolidayAsync } from 'src/services/holiday/holiday.service';
import { Holiday } from 'src/data/holiday/holiday.model';

// ----------------------------------------------------------------------
export type THolidayCreateFormProps = {
  open: boolean;
  onClose?: any;
  fetchDataList: () => void;
};

export function HolidayCreateForm({ open, onClose, fetchDataList }: THolidayCreateFormProps) {
  const dispatch = useAppDispatch();

  const methods = useForm<any>({
    mode: 'all',
    defaultValues: {
      name: '',
      dateRange: [],
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload: Holiday = {
        ...data,
        startDate: data.dateRange[0],
        endDate: data.dateRange[1],
      };

      const response = await dispatch(addHolidayAsync(payload));
      if (response.meta.requestStatus === 'fulfilled') {
        toast.success('Add holiday successfully!');
        fetchDataList();
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
      onClose={() => {
        onClose();
      }}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{'Create Holiday'}</DialogTitle>

        <DialogContent>
          <Box rowGap={3} columnGap={2} display="grid" sx={{ mt: 2 }}>
            <Field.Text
              rules={{
                required: 'Holiday name is required.',
              }}
              name="name"
              label="Holiday name"
            />
            <Field.DateRange
              rules={{
                required: 'Date range is required.',
              }}
              name="dateRange"
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {'Create'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
