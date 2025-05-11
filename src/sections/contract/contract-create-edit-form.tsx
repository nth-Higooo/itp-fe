import React, { RefObject, useEffect, useMemo, useState } from 'react';
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
import {
  addContractAsync,
  handleContract,
  handlePdfContractFile,
  resignContractAsync,
} from 'src/services/contract';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { Link, Stack, Typography, useTheme } from '@mui/material';
import { toast } from 'src/components/snackbar';
import { ButtonCreate, ButtonImport } from 'src/components/button-permission/button-permission';
import { UserPermission } from 'src/data/auth/role.model';
import { Iconify } from 'src/components/iconify';
import { styled } from '@mui/material';
import { selectContract } from 'src/redux/contract';
import { Employee } from 'src/data/employee/employee.model';
import { useBoolean } from 'src/hooks/use-boolean';
import { getSession } from 'src/services/token.service';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------
const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 36px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

export type TContractCreateEditFormProps = {
  currentEmployee?: Employee;
  currentContract?: any;
  refreshFunction: () => void;
  open: boolean;
  onClose?: any;
};

export function ContractCreateEditForm({
  currentEmployee,
  currentContract,
  refreshFunction,
  open,
  onClose,
}: TContractCreateEditFormProps) {
  const dispatch = useAppDispatch();
  const defaultValues = useMemo(
    () => ({
      isRemote: currentContract?.isRemote ? 1 : 0,
      workingType: currentContract?.workingType || '',
      contractNumber: currentContract?.contractNumber || '',
      contractType: currentContract?.contractType || '',
      startDate: currentContract?.startDate || '',
      endDate: currentContract?.endDate || '',
      status: currentContract?.status,
      contractFile: currentContract?.contractFile,
    }),
    [currentContract]
  );
  const workingTypes = ['Parttime', 'Fulltime'];
  const contractTypes = [
    'Intern',
    'Probation',
    'Official (2 years)',
    'Official (1 year)',
    'Official (3 years)',
    'Official (Indefinitely)',
  ];
  const theme = useTheme();
  const contractStatus = ['Active', 'Pending', 'Expired', 'Terminated'];
  const { selectedContract, error } = useAppSelector(selectContract);
  const confirm = useBoolean();
  const [showEndDate, setShowEndDate] = useState(true);
  const isEdit = currentContract ? true : false;
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const inputOpenFileRef: RefObject<HTMLInputElement> = React.createRef();
  const methods = useForm({
    mode: 'all',
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    getValues,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;
  const StartDate = watch('startDate');
  const ContractTypes = watch('contractType');
  useEffect(() => {
    if (getValues('contractType') === 'Official (Indefinitely)') {
      setShowEndDate(false);
    } else {
      setShowEndDate(true);
    }
    if (StartDate) {
      if (getValues('contractType') === 'Official (3 years)') {
        const startDate = getValues('startDate');
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1095);
        setValue('endDate', endDate);
      }
      if (getValues('contractType') === 'Official (2 years)') {
        const startDate = getValues('startDate');
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 730);
        setValue('endDate', endDate);
      }
      if (getValues('contractType') === 'Official (1 year)') {
        const startDate = getValues('startDate');
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 365);
        setValue('endDate', endDate);
      }
      if (getValues('contractType') === 'Intern') {
        const startDate = getValues('startDate');
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 180);
        setValue('endDate', endDate);
      }
      if (getValues('contractType') === 'Probation') {
        const startDate = getValues('startDate');
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 60);
        setValue('endDate', endDate);
      }
      if (getValues('contractType') === 'Part-time') {
        const startDate = getValues('startDate');
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 180);
        setValue('endDate', endDate);
      }
    }
  }, [StartDate, ContractTypes, setValue, getValues]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles) {
      setFiles(droppedFiles);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      ...data,
      isRemote: Boolean(data.isRemote),
      id: currentContract?.id,
      employeeId: currentEmployee?.id,
      contractFile: files ? selectedContract.contractFile : currentContract?.contractFile,
    };
    if (files) {
      const response = await dispatch(handlePdfContractFile(files[0]));
      if (response.meta.requestStatus === 'fulfilled') {
        payload.contractFile = response.payload;
      }
    }
    if (currentContract) {
      const response = await dispatch(resignContractAsync(payload));
      if (response.meta.requestStatus === 'fulfilled') {
        console.log(payload);
        toast.success('Update contract successfully!');
        refreshFunction();
        reset();
        onClose();
        setFiles(null);
      }
    } else {
      const response = await dispatch(handleContract(payload));
      if (response.meta.requestStatus === 'fulfilled') {
        const responses = response.payload as any;
        if (responses.message === 'The contract dates overlap with an existing contract.') {
          confirm.onTrue();
        } else {
          toast.success('Create contract successfully!');
          refreshFunction();
          reset();
          onClose();
          setFiles(null);
        }
      }
    }
  });
  const confirmAdd = handleSubmit(async (data) => {
    const payload = {
      ...data,
      isRemote: Boolean(data.isRemote),
      id: currentContract?.id,
      employeeId: currentEmployee?.id,
      contractFile: files ? selectedContract.contractFile : currentContract?.contractFile,
    };
    const response = await dispatch(addContractAsync(payload));
    if (response.meta.requestStatus === 'fulfilled') {
      toast.success('Create contract successfully!');
      refreshFunction();
      confirm.onFalse();
      reset();
      setFiles(null);
      onClose();
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
        <DialogTitle>{currentContract ? 'Update Contract' : 'Create Contract'}</DialogTitle>

        <DialogContent>
          <Stack gap={5} sx={{ mt: 1 }}>
            <Stack
              spacing={2}
              gap={5}
              alignItems={{ xs: 'flex-end', md: 'center' }}
              direction="column"
            >
              <Stack
                direction="row"
                width="100%"
                display="flex"
                justifyContent="space-between"
                gap={3}
              >
                <Field.Text
                  required
                  name="contractNumber"
                  disabled={isEdit}
                  label="Contract Number"
                  rules={{
                    required: 'Contract Number is required.',
                  }}
                />
                <Box sx={{ width: '30%' }}>
                  <Field.Select name="isRemote" label="Working Place" required>
                    <MenuItem value={1}>Remote</MenuItem>
                    <MenuItem value={0}>Onsite</MenuItem>
                  </Field.Select>
                </Box>
              </Stack>
              <Field.Select
                required
                name="workingType"
                label="Working Type"
                rules={{
                  required: 'Working Type is required.',
                }}
              >
                {workingTypes.map((item: string) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Field.Select>
              <Field.Select
                required
                name="contractType"
                label="Contract Type"
                rules={{
                  required: 'Working Type is required.',
                }}
              >
                {contractTypes.map((item: string) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Field.Select>
              {currentContract && (
                <Field.Select required name="status" label="Contract Status">
                  {contractStatus.map((item: string) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Field.Select>
              )}

              <Box width="100%" display="flex" justifyContent="space-between" gap={2}>
                <Field.DatePicker
                  name="startDate"
                  label="Start Date"
                  rules={{
                    required: 'Start Date is required.',
                  }}
                />
                {showEndDate && <Field.DatePicker name="endDate" label="End Date" />}
              </Box>
            </Stack>
          </Stack>
        </DialogContent>

        <Box
          sx={{
            justifyContent: { xs: 'space-around', md: 'space-between' },
            flexDirection: { xs: 'column', md: 'row' },
            display: 'flex',
            my: 3,
          }}
        >
          <Box sx={{ ml: '3%' }}>
            {currentContract?.contractFile ? (
              <Box>
                <Link
                  style={{
                    color: theme.palette.mode === 'dark' ? 'white' : '#3d5afe',
                    fontSize: 'small',
                    textOverflow: 'ellipsis',
                    width: '10px',
                    overflow: 'hidden',
                  }}
                  href={currentContract.contractFile}
                  target="_blank"
                >
                  {
                    currentContract.contractFile.split('/')[
                      currentContract.contractFile.split('/').length - 1
                    ]
                  }
                </Link>
              </Box>
            ) : (
              <Box mb={2}></Box>
            )}
            <Box
              sx={{
                border: dragging ? '2px dashed #1976d2' : '2px dashed #cccccc',
                borderRadius: '8px',
                alignSelf: 'center',
                display: 'flex',
                backgroundColor: dragging ? '#e3f2fd' : '#fafafa',
                cursor: 'pointer',
                justifyContent: 'center',
                alignItems: 'center',
                width: '80%',
                minWidth: '220px',
                height: '54px',
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => inputOpenFileRef.current?.click()}
            >
              {files ? (
                <Typography
                  sx={{
                    color: theme.palette.mode === 'dark' ? '#212121' : '#212121',
                  }}
                >{`${files[0].name} file selected`}</Typography>
              ) : (
                <Typography
                  sx={{
                    color: theme.palette.mode === 'dark' ? '#212121' : '#212121',
                  }}
                >
                  Upload Contract
                </Typography>
              )}
              <VisuallyHiddenInput
                name="contractFile"
                type="file"
                ref={inputOpenFileRef}
                accept={'application/pdf'} // specify allowed file types here
                onChange={(event) => {
                  const selectedFiles = event.target.files;
                  if (selectedFiles) {
                    setFiles(selectedFiles);
                  }
                }}
              />
            </Box>
          </Box>
          <DialogActions sx={{ width: '50%' }}>
            <Button
              variant="outlined"
              onClick={() => {
                reset();
                setFiles(null);
                onClose();
              }}
            >
              Cancel
            </Button>

            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {currentContract ? 'Update' : 'Create'}
            </LoadingButton>
            <ConfirmDialog
              open={confirm.value}
              onClose={() => {
                confirm.onFalse();
              }}
              title="Confirm"
              content="The contract dates overlap with an existing contract. Are you sure want to add this Contract?"
              action={
                <Button variant="contained" color="warning" type="submit" onClick={confirmAdd}>
                  Add Contract
                </Button>
              }
            />
          </DialogActions>
        </Box>
      </Form>
    </Dialog>
  );
}
