import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { Form, Field } from 'src/components/hook-form';
import {
  CardHeader,
  Divider,
  IconButton,
  SvgIcon,
  Typography,
  Link,
  useTheme,
  Button,
  Modal,
} from '@mui/material';
import { EmployeeTabProps } from './employee-tab-general';
import { GovernmentInfo } from 'src/data/employee/onboarding.model';
import { updateEmployeeAsync, uploadImage } from 'src/services/employee/employee.service';
import { useAppDispatch } from 'src/redux/store';
import { toast } from 'src/components/snackbar';
import { setEmployeeRequestChange } from 'src/redux/employee/employees.slice';
import { fData } from 'src/utils/format-number';
import { DeleteButton } from 'src/components/upload';

// ----------------------------------------------------------------------

export function EmployeeTabGovernment({ currentEmployee, canEdit, role }: EmployeeTabProps) {
  const dispatch = useAppDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const onToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const handleOpenModal = (image: any) => {
    setSelectedImage(image);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImage('');
  };

  const handleDeleteFile = (fileKey: keyof GovernmentInfo) => {
    methods.resetField(fileKey);
    setSelectedImage('');
  };

  const defaultValues = useMemo(
    () => ({
      vneIDNo: currentEmployee?.vneIDNo || '',
      vneIDDate: currentEmployee?.vneIDDate || '',
      vneIDPlace: currentEmployee?.vneIDPlace || '',
      pitNo: currentEmployee?.pitNo || '',
      siNo: currentEmployee?.siNo || '',
      vneIDCardFront: currentEmployee?.vneIDCardFront || '',
      vneIDCardBack: currentEmployee?.vneIDCardBack || '',
    }),
    [currentEmployee]
  );

  const methods = useForm<GovernmentInfo>({
    mode: 'onSubmit',
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const { unsubscribe } = watch((value) => {
      dispatch(setEmployeeRequestChange(value));
    });
    return () => unsubscribe();
  }, [watch]);

  const onSubmit = handleSubmit(async (data: GovernmentInfo) => {
    try {
      let frontID = '';
      let backID = '';
      if (typeof data.vneIDCardFront === 'object') {
        frontID = await uploadImage(data.vneIDCardFront.file);
      }
      if (typeof data.vneIDCardBack === 'object') {
        backID = await uploadImage(data.vneIDCardBack.file);
      }
      const payload = {
        id: currentEmployee?.id,
        ...data,
        vneIDCardFront: frontID,
        vneIDCardBack: backID,
      };
      const response = await dispatch(updateEmployeeAsync(payload));

      if (response.meta.requestStatus === 'fulfilled') {
        toast.success('Update employee successfully!');
      }
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => {
    reset(defaultValues);
  }, [currentEmployee]);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Card>
            <CardHeader
              title="Government"
              sx={{ mb: 3 }}
              action={
                <IconButton size="small" onClick={onToggleExpand} sx={{ marginLeft: 2 }}>
                  <SvgIcon
                    sx={{
                      width: 16,
                      height: 16,
                      transform: isExpanded ? 'rotate(270deg)' : 'rotate(90deg)',
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    <path
                      fill="currentColor"
                      d="M13.83 19a1 1 0 0 1-.78-.37l-4.83-6a1 1 0 0 1 0-1.27l5-6a1 1 0 0 1 1.54 1.28L10.29 12l4.32 5.36a1 1 0 0 1-.78 1.64"
                    />
                  </SvgIcon>
                </IconButton>
              }
            />
            {isExpanded && (
              <Stack>
                <Stack sx={{ p: 3 }}>
                  <Box
                    rowGap={3}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(2, 1fr)',
                    }}
                  >
                    <Field.Upload
                      label="Upload ID Card"
                      disabled={!canEdit}
                      name="vneIDCardFront"
                      maxSize={3145728}
                      sx={{
                        gridColumn: 'span 1',
                        mb: 2,
                      }}
                      helperText={
                        <>
                          <Button
                            variant="contained"
                            component="span"
                            sx={{
                              mt: 2,
                              display: 'block',
                              textAlign: 'center',
                            }}
                            onClick={() => handleOpenModal(currentEmployee?.vneIDCardFront)}
                          >
                            Front-side ID
                          </Button>
                          <Typography
                            variant="caption"
                            sx={{
                              mt: 1,
                              mx: 'auto',
                              display: 'block',
                              textAlign: 'center',
                              color: 'text.disabled',
                            }}
                          >
                            Allowed *.jpeg, *.jpg, *.png
                            <br /> max size of {fData(3145728)}
                          </Typography>
                        </>
                      }
                    />
                    <Field.Upload
                      label="Upload ID Card"
                      disabled={!canEdit}
                      name="vneIDCardBack"
                      maxSize={3145728}
                      helperText={
                        <>
                          <Button
                            variant="contained"
                            component="span"
                            sx={{
                              mt: 2,
                              display: 'block',
                              textAlign: 'center',
                            }}
                            onClick={() => handleOpenModal(currentEmployee?.vneIDCardBack)}
                          >
                            Back-side ID
                          </Button>
                          <Typography
                            variant="caption"
                            sx={{
                              mt: 1,
                              mx: 'auto',
                              display: 'block',
                              textAlign: 'center',
                              color: 'text.disabled',
                            }}
                          >
                            Allowed *.jpeg, *.jpg, *.png
                            <br /> max size of {fData(3145728)}
                          </Typography>
                        </>
                      }
                      sx={{
                        gridColumn: 'span 1',
                      }}
                    />

                    <Box
                      rowGap={3}
                      columnGap={2}
                      display="grid"
                      gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(4, 1fr)' }}
                      sx={{ gridColumn: 'span 2' }}
                    >
                      <Field.Text
                        disabled={!canEdit}
                        rules={{
                          required: {
                            value: true,
                            message: 'ID No. is required.',
                          },
                        }}
                        label="ID No."
                        name="vneIDNo"
                        sx={{ gridColumn: 'span 1' }}
                      />
                      <Field.DatePicker
                        disabled={!canEdit}
                        rules={{ required: 'Date issued is required.' }}
                        name="vneIDDate"
                        label="Date Issued"
                        sx={{ gridColumn: 'span 1' }}
                      />
                      <Field.Text
                        disabled={!canEdit}
                        rules={{
                          required: {
                            value: true,
                            message: 'Place issued is required.',
                          },
                        }}
                        label="Place Issued"
                        name="vneIDPlace"
                        sx={{ gridColumn: 'span 2' }}
                      />

                      <Field.Text
                        disabled={!canEdit}
                        rules={{
                          required: {
                            value: true,
                            message: 'PIT No is required.',
                          },
                        }}
                        label="PIT No"
                        name="pitNo"
                        sx={{ gridColumn: 'span 2' }}
                      />
                      <Field.Text
                        disabled={!canEdit}
                        rules={{
                          required: {
                            value: true,
                            message: 'SI No is required.',
                          },
                        }}
                        label="SI No"
                        name="siNo"
                        sx={{ gridColumn: 'span 2' }}
                      />
                    </Box>
                  </Box>
                </Stack>
                {role === 'Employer' ? (
                  <>
                    <Divider sx={{ borderStyle: 'dashed' }} />

                    <Stack spacing={1.5} direction="row" justifyContent="flex-end" sx={{ p: 3 }}>
                      <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        {'Save changes'}
                      </LoadingButton>
                    </Stack>
                  </>
                ) : (
                  <></>
                )}
              </Stack>
            )}

            <Modal
              open={openModal}
              onClose={handleCloseModal}
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '600px',
                  maxHeight: '100%',
                  overflow: 'auto',
                  bgcolor: 'background.paper',
                  boxShadow: 24,
                  p: 4,
                  borderRadius: 2,
                }}
              >
                <DeleteButton
                  onClick={handleCloseModal}
                  sx={{ position: 'absolute', top: 10, right: 10 }}
                />

                <img src={selectedImage} alt="Uploaded" style={{ width: '100%', height: 'auto' }} />
              </Box>
            </Modal>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
