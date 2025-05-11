import { useAppDispatch } from 'src/redux/store';
import { EmployeeTabProps } from './employee-tab-general';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { BenefitInfo } from 'src/data/employee/onboarding.model';
import { updateEmployeeAsync } from 'src/services/employee/employee.service';
import { toast } from 'sonner';
import { Box, Card, CardHeader, Divider, Grid, Stack } from '@mui/material';
import { Field } from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import { useMemo } from 'react';
import { addComma, removeNonNumeric } from 'src/utils/format-number';

export function EmployeeBenefit({ currentEmployee, canEdit }: EmployeeTabProps) {
  const dispatch = useAppDispatch();
  const defaultValues = useMemo(
    () =>
      addCommaForAllFields({
        healthCare: currentEmployee?.healthCare || 0,
        healthCheck: currentEmployee?.healthCheck || 0,
        teamFund: currentEmployee?.teamFund || 0,
        tetGift: currentEmployee?.tetGift || 0,
        YEP: currentEmployee?.YEP || 0,
        parkingFee: currentEmployee?.parkingFee || 0,
        birthdayGift: currentEmployee?.birthdayGift || 0,
        midAutumnGift: currentEmployee?.midAutumnGift || 0,
        companyTrip: currentEmployee?.companyTrip || 0,
      }),
    [currentEmployee]
  );

  const methods = useForm<BenefitInfo>({
    mode: 'onSubmit',
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  function removeNonNumericForAllFields(data: BenefitInfo): BenefitInfo {
    const result = { ...data };
    (Object.keys(result) as (keyof BenefitInfo)[]).forEach((key) => {
      result[key] = removeNonNumeric(result[key].toString());
    });
    return result;
  }

  function addCommaForAllFields(data: BenefitInfo): BenefitInfo {
    const result = { ...data };
    (Object.keys(result) as (keyof BenefitInfo)[]).forEach((key) => {
      result[key] = addComma(result[key].toString());
    });
    return result;
  }

  const onSubmit = async (data: BenefitInfo) => {
    try {
      const payload = {
        id: currentEmployee?.id,
        ...removeNonNumericForAllFields(data),
      };
      const response = await dispatch(updateEmployeeAsync(payload));
      if (response.meta.requestStatus === 'fulfilled') {
        toast.success('Update employee benefit successfully!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3, mt: 3 }}>
              <CardHeader title="Benefits" />
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
                    name="healthCare"
                    control={methods.control}
                    render={({ field }) => (
                      <Field.Text
                        disabled={!canEdit}
                        onChange={(e) => {
                          field.onChange(addComma(removeNonNumeric(e.target.value)));
                        }}
                        type="text"
                        name="healthCare"
                        label="Health Care"
                      />
                    )}
                  />
                  <Controller
                    name="healthCheck"
                    control={methods.control}
                    render={({ field }) => (
                      <Field.Text
                        disabled={!canEdit}
                        onChange={(e) => {
                          field.onChange(addComma(removeNonNumeric(e.target.value)));
                        }}
                        type="text"
                        name="healthCheck"
                        label="Health Check"
                      />
                    )}
                  />
                  <Controller
                    name="teamFund"
                    control={methods.control}
                    render={({ field }) => (
                      <Field.Text
                        disabled={!canEdit}
                        onChange={(e) => {
                          field.onChange(addComma(removeNonNumeric(e.target.value)));
                        }}
                        type="text"
                        name="teamFund"
                        label="Team Fund"
                      />
                    )}
                  />
                  <Controller
                    name="tetGift"
                    control={methods.control}
                    render={({ field }) => (
                      <Field.Text
                        disabled={!canEdit}
                        onChange={(e) => {
                          field.onChange(addComma(removeNonNumeric(e.target.value)));
                        }}
                        type="text"
                        name="tetGift"
                        label="Tet Gift"
                      />
                    )}
                  />
                  <Controller
                    name="YEP"
                    control={methods.control}
                    render={({ field }) => (
                      <Field.Text
                        disabled={!canEdit}
                        onChange={(e) => {
                          field.onChange(addComma(removeNonNumeric(e.target.value)));
                        }}
                        type="text"
                        name="YEP"
                        label="YEP"
                      />
                    )}
                  />
                  <Controller
                    name="parkingFee"
                    control={methods.control}
                    render={({ field }) => (
                      <Field.Text
                        disabled={!canEdit}
                        onChange={(e) => {
                          field.onChange(addComma(removeNonNumeric(e.target.value)));
                        }}
                        type="text"
                        name="parkingFee"
                        label="Parking Fee"
                      />
                    )}
                  />
                  <Controller
                    name="birthdayGift"
                    control={methods.control}
                    render={({ field }) => (
                      <Field.Text
                        disabled={!canEdit}
                        onChange={(e) => {
                          field.onChange(addComma(removeNonNumeric(e.target.value)));
                        }}
                        type="text"
                        name="birthdayGift"
                        label="Birthday Gift"
                      />
                    )}
                  />
                  <Controller
                    name="midAutumnGift"
                    control={methods.control}
                    render={({ field }) => (
                      <Field.Text
                        disabled={!canEdit}
                        onChange={(e) => {
                          field.onChange(addComma(removeNonNumeric(e.target.value)));
                        }}
                        type="text"
                        name="midAutumnGift"
                        label="Mid Autumn Gift"
                      />
                    )}
                  />
                  <Controller
                    name="companyTrip"
                    control={methods.control}
                    render={({ field }) => (
                      <Field.Text
                        disabled={!canEdit}
                        onChange={(e) => {
                          field.onChange(addComma(removeNonNumeric(e.target.value)));
                        }}
                        type="text"
                        name="companyTrip"
                        label="Company Trip"
                      />
                    )}
                  />
                </Box>
              </Stack>

              {canEdit && (
                <>
                  <Divider sx={{ borderStyle: 'dashed' }} />
                  <Stack spacing={1.5} direction="row" justifyContent="flex-end" sx={{ p: 3 }}>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                      Save changes
                    </LoadingButton>
                  </Stack>
                </>
              )}
            </Card>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
}
