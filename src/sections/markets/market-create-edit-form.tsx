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
import { addMarketAsync, updateMarketAsync } from 'src/services/market.service';
import { Market } from 'src/data/market/market.model';

// ----------------------------------------------------------------------
export type TCreateEditFormProps = {
  currentMarket?: any;
  open: boolean;
  onClose: () => void;
  fetchDataList: () => void;
};

export function MarketCreateEditForm({
  currentMarket,
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
      if (currentMarket) {
        reset({
          id: currentMarket?.id || '',
          name: currentMarket?.name || '',
          description: currentMarket?.description || '',
        });
      } else {
        reset({
          id: '',
          name: '',
          description: '',
        });
      }
    }
  }, [currentMarket, open, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload: Market = {
        ...data,
        name: data.name,
        description: data.description,
      };

      if (!data.id) {
        const response = await dispatch(addMarketAsync(payload));
        if (response.meta.requestStatus === 'fulfilled') {
          toast.success('Add degree successfully!');
          reset();
          fetchDataList();
          onClose();
        }
      } else {
        const response = await dispatch(updateMarketAsync(payload));
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
        <DialogTitle>{currentMarket ? 'Update Market' : 'Create Market'}</DialogTitle>

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
                required: 'D is required.',
              }}
              name="name"
              label="Market name"
            />
            <Field.Text rows={3} name="description" label="Description" />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {currentMarket ? 'Update' : 'Create'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
