import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import { Form, Field } from 'src/components/hook-form';
import { EmployeeTabProps } from './employee-tab-general';
import { updateEmployeeAsync } from 'src/services/employee/employee.service';
import { useAppDispatch } from 'src/redux/store';
import { SalaryInfo } from 'src/data/employee/onboarding.model';
import { toast } from 'src/components/snackbar';
import { CardHeader, Divider } from '@mui/material';
import { addComma, removeNonNumeric } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export function EmployeeTabSalary({ currentEmployee, canEdit }: EmployeeTabProps) {
  const dispatch = useAppDispatch();

  const defaultValues = useMemo(
    () =>
      addCommaForAllFields({
        basicSalary: currentEmployee?.basicSalary || 0,
        responsibilityAllowance: currentEmployee?.responsibilityAllowance || 0,
        petrolAllowance: currentEmployee?.petrolAllowance || 0,
        phoneAllowance: currentEmployee?.phoneAllowance || 0,
        lunchAllowance: currentEmployee?.lunchAllowance || 0,
        seniorityBonus: currentEmployee?.seniorityBonus || 0,
        performanceBonus: currentEmployee?.performanceBonus || 0,
        overtimeIncome: currentEmployee?.overtimeIncome || 0,
        otherBonus: currentEmployee?.otherBonus || 0,
        otherIncome: currentEmployee?.otherIncome || 0,
        socialInsurance: currentEmployee?.socialInsurance || 0,
        personalIncomeTax: currentEmployee?.personalIncomeTax || 0,
        othersDeduction: currentEmployee?.othersDeduction || 0,
        netAmount: currentEmployee?.netAmount || 0,
      }),
    [currentEmployee]
  );

  const methods = useForm<SalaryInfo>({
    mode: 'onSubmit',
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  function removeNonNumericForAllFields(data: SalaryInfo): SalaryInfo {
    const result = { ...data };
    (Object.keys(result) as (keyof SalaryInfo)[]).forEach((key) => {
      result[key] = removeNonNumeric(result[key].toString());
    });
    return result;
  }

  function addCommaForAllFields(data: SalaryInfo): SalaryInfo {
    const result = { ...data };
    (Object.keys(result) as (keyof SalaryInfo)[]).forEach((key) => {
      result[key] = addComma(result[key].toString());
    });
    return result;
  }

  const onSubmit = handleSubmit(async (data: SalaryInfo) => {
    try {
      const payload = {
        id: currentEmployee?.id,
        ...removeNonNumericForAllFields(data),
      };

      if (!currentEmployee) {
        // const response = await dispatch(addEmployeeAsync(payload));
        // if (response.meta.requestStatus === 'fulfilled') {
        //   toast.success('Add employee successfully!');
        // }
      } else {
        const response = await dispatch(updateEmployeeAsync(payload));

        if (response.meta.requestStatus === 'fulfilled') {
          toast.success('Update employee successfully!');
        }
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
          <Card sx={{ p: 3 }}>
            <CardHeader title="Salary" />
            <Stack sx={{ p: 3 }}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                }}
              >
                <Controller
                  name="basicSalary"
                  control={methods.control}
                  render={({ field }) => (
                    <Field.Text
                      onChange={(e) => {
                        field.onChange(addComma(removeNonNumeric(e.target.value)));
                      }}
                      disabled={!canEdit}
                      type="text"
                      name="basicSalary"
                      label="Basic salary"
                    />
                  )}
                />
                <Controller
                  name="responsibilityAllowance"
                  control={methods.control}
                  render={({ field }) => (
                    <Field.Text
                      onChange={(e) => {
                        field.onChange(addComma(removeNonNumeric(e.target.value)));
                      }}
                      disabled={!canEdit}
                      type="text"
                      name="responsibilityAllowance"
                      label="Responsibility allowance"
                    />
                  )}
                />
                <Controller
                  name="petrolAllowance"
                  control={methods.control}
                  render={({ field }) => (
                    <Field.Text
                      onChange={(e) => {
                        field.onChange(addComma(removeNonNumeric(e.target.value)));
                      }}
                      disabled={!canEdit}
                      type="text"
                      name="petrolAllowance"
                      label="Petrol allowance"
                    />
                  )}
                />
                <Controller
                  name="phoneAllowance"
                  control={methods.control}
                  render={({ field }) => (
                    <Field.Text
                      onChange={(e) => {
                        field.onChange(addComma(removeNonNumeric(e.target.value)));
                      }}
                      disabled={!canEdit}
                      type="text"
                      name="phoneAllowance"
                      label="Phone allowance"
                    />
                  )}
                />
                <Controller
                  name="lunchAllowance"
                  control={methods.control}
                  render={({ field }) => (
                    <Field.Text
                      onChange={(e) => {
                        field.onChange(addComma(removeNonNumeric(e.target.value)));
                      }}
                      disabled={!canEdit}
                      type="text"
                      name="lunchAllowance"
                      label="Lunch allowance"
                    />
                  )}
                />
                <Controller
                  name="seniorityBonus"
                  control={methods.control}
                  render={({ field }) => (
                    <Field.Text
                      onChange={(e) => {
                        field.onChange(addComma(removeNonNumeric(e.target.value)));
                      }}
                      disabled={!canEdit}
                      type="text"
                      name="seniorityBonus"
                      label="Seniority bonus"
                    />
                  )}
                />
                <Controller
                  name="performanceBonus"
                  control={methods.control}
                  render={({ field }) => (
                    <Field.Text
                      onChange={(e) => {
                        field.onChange(addComma(removeNonNumeric(e.target.value)));
                      }}
                      disabled={!canEdit}
                      type="text"
                      name="performanceBonus"
                      label="Performance bonus"
                    />
                  )}
                />
                <Controller
                  name="overtimeIncome"
                  control={methods.control}
                  render={({ field }) => (
                    <Field.Text
                      onChange={(e) => {
                        field.onChange(addComma(removeNonNumeric(e.target.value)));
                      }}
                      disabled={!canEdit}
                      type="text"
                      name="overtimeIncome"
                      label="Overtime income"
                    />
                  )}
                />
                <Controller
                  name="otherBonus"
                  control={methods.control}
                  render={({ field }) => (
                    <Field.Text
                      onChange={(e) => {
                        field.onChange(addComma(removeNonNumeric(e.target.value)));
                      }}
                      disabled={!canEdit}
                      type="text"
                      name="otherBonus"
                      label="Other bonus"
                    />
                  )}
                />
                <Controller
                  name="otherIncome"
                  control={methods.control}
                  render={({ field }) => (
                    <Field.Text
                      onChange={(e) => {
                        field.onChange(addComma(removeNonNumeric(e.target.value)));
                      }}
                      disabled={!canEdit}
                      type="text"
                      name="otherIncome"
                      label="Other income"
                    />
                  )}
                />
                <Controller
                  name="socialInsurance"
                  control={methods.control}
                  render={({ field }) => (
                    <Field.Text
                      onChange={(e) => {
                        field.onChange(addComma(removeNonNumeric(e.target.value)));
                      }}
                      disabled={!canEdit}
                      type="text"
                      name="socialInsurance"
                      label="Social insurance"
                    />
                  )}
                />
                <Controller
                  name="personalIncomeTax"
                  control={methods.control}
                  render={({ field }) => (
                    <Field.Text
                      onChange={(e) => {
                        field.onChange(addComma(removeNonNumeric(e.target.value)));
                      }}
                      disabled={!canEdit}
                      type="text"
                      name="personalIncomeTax"
                      label="Personal income tax"
                    />
                  )}
                />
                <Controller
                  name="othersDeduction"
                  control={methods.control}
                  render={({ field }) => (
                    <Field.Text
                      onChange={(e) => {
                        field.onChange(addComma(removeNonNumeric(e.target.value)));
                      }}
                      disabled={!canEdit}
                      type="text"
                      name="othersDeduction"
                      label="Others deduction"
                    />
                  )}
                />
                <Controller
                  name="netAmount"
                  control={methods.control}
                  render={({ field }) => (
                    <Field.Text
                      onChange={(e) => {
                        field.onChange(addComma(removeNonNumeric(e.target.value)));
                      }}
                      disabled={!canEdit}
                      type="text"
                      name="netAmount"
                      label="Net amount"
                    />
                  )}
                />
              </Box>
            </Stack>

            {canEdit ? (
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
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
