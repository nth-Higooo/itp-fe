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
import { addContractAsync, handleContract, handlePdfContractFile, resignContractAsync } from 'src/services/contract';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { Stack, Typography } from '@mui/material';
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
import { updateEmployeeRemainingAnnualLeaveAsync } from 'src/services/leave/leave.service';

// ----------------------------------------------------------------------
export type TEmployeeRemainingLeaveInformation = {
  currentEmployee?: any;
  refreshFunction: () => void;
  open: boolean;
  onClose?: any;
};

export function UpdateRemainingAnnualLeaveForm({
  currentEmployee,
  refreshFunction,
  open,
  onClose,
}: TEmployeeRemainingLeaveInformation) {
  const dispatch = useAppDispatch();
  const defaultValues = useMemo(
    () => ({
    employeeName: currentEmployee?.fullName || '',
    total: currentEmployee?.totalAnnualLeave || 0,
    remaining: currentEmployee?.remainingAnnualLeave || 0,

    }),
    [currentEmployee]
  );

  const methods = useForm({
    mode: 'all',
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
      const payload = {
        quantity: data.remaining,
        year: new Date().getFullYear(),
      }
      if (currentEmployee) {
        const response = await dispatch(updateEmployeeRemainingAnnualLeaveAsync({
            id: currentEmployee.id,
            params: payload,
        }));
        if (response.meta.requestStatus === 'fulfilled') {
          toast.success('Update remaining annual leave successfully');
          refreshFunction();
          onClose();
        }
      }
  }
);


  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{'Update Remaining Annual Leave'}</DialogTitle>

        <DialogContent>
          <Stack gap={5} sx={{ mt: 1 }}>
            <Stack
              spacing={2}
              gap={5}
              alignItems={{ xs: 'flex-end', md: 'center' }}
              direction="column"
            >
              <Stack
                width="100%"
                display="flex"
                justifyContent="space-between"
                gap={3}
              >
                <Field.Text
                  required
                  name="employeeName"
                  disabled={true}
                  label="Employee full Name"
                />
                <Stack direction="row" justifyContent="space-between" gap={4}>
                <Field.Text
                  required
                  name="total"
                  disabled={true}
                  label="Total Annual Leave"
                />
                <Field.Text
                  required
                  type='number' 
                  name="remaining"
                  label=" Remaining Annual Leave"
                  rules={{
                    required: 'Remaining Annual Leave is required.',
                  }}
                />
                </Stack>
              </Stack>
            </Stack>
            </Stack>
            </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => {
                reset();
                onClose();
              }}
            >
              Cancel
            </Button>

            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {'Update'}
            </LoadingButton>
          </DialogActions>
      </Form>
    </Dialog>
  );
}
