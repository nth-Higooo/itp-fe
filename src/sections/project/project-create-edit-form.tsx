import { useEffect } from 'react';
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
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { toast } from 'src/components/snackbar';
import { ProjectRequest, ProjectStatus, ProjectType } from 'src/data/project';
import { addProjectAsync, updateProjectAsync } from 'src/services/project.service';
import { selectSelections } from 'src/redux/selections/selections.slice';
import { getAllDepartmentsAsync, getAllEmployeesAsync } from 'src/services/selection.service';
import { selectEmployees } from 'src/redux/employee/employees.slice';
import { createFilterOptions } from '@mui/material';
import { Department } from 'src/data/employer/department.model';
import { getMarketAsync } from 'src/services/market.service';

// ----------------------------------------------------------------------

export const PROJECT_STATUS_OPTIONS = [
  { value: ProjectStatus.INITIAL, label: 'Initial' },
  { value: ProjectStatus.PLANNING, label: 'Planning' },
  { value: ProjectStatus.EVALUATION, label: 'Evaluation' },
  { value: ProjectStatus.QUOTES, label: 'Quotes' },
  { value: ProjectStatus.SIGN_CONTRACT, label: 'Sign Contract' },
  { value: ProjectStatus.REJECT, label: 'Reject' },
  { value: ProjectStatus.KICK_OFF, label: 'Kick Off' },
  { value: ProjectStatus.IN_PROGRESS, label: 'In Progress' },
  { value: ProjectStatus.END, label: 'End' },
];

export const PROJECT_TYPE_OPTIONS = [
  { value: ProjectType.ODC, label: 'ODC' },
  { value: ProjectType.PROJECT_BASED, label: 'Project Based' },
  { value: ProjectType.TIME_MATERIAL, label: 'Time Material' },
];

// ----------------------------------------------------------------------

export type TProjectCreateEditFormProps = {
  currentProject?: any;
  open: boolean;
  onClose?: any;
};

export function ProjectCreateEditForm({
  currentProject,
  open,
  onClose,
}: TProjectCreateEditFormProps) {
  const dispatch = useAppDispatch();

  const { departments, getDepartmentStatus, employees, getEmployeeStatus, markets } =
    useAppSelector(selectSelections);

  const methods = useForm<any>({
    mode: 'all',
    defaultValues: {},
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset({
      id: currentProject?.id || '',
      name: currentProject?.name || '',
      clientName: currentProject?.clientName || '',
      status: currentProject?.status || ProjectStatus.INITIAL,
      type: currentProject?.type || '',
      business: currentProject?.business || '',
      technologies: currentProject?.technologies || '',
      startDate: currentProject?.startDate || new Date(),
      endDate: currentProject?.endDate || new Date(),
      communicationChannels: currentProject?.communicationChannels || '',
      notes: currentProject?.notes || '',
      market: currentProject?.market?.id || '',
      department: currentProject?.department?.id || '',
      projectManager: currentProject?.projectManager?.id,
      accountManager: currentProject?.accountManager?.id,
    });
  }, [currentProject]);

  useEffect(() => {
    dispatch(getAllDepartmentsAsync());
    dispatch(getAllEmployeesAsync());
    dispatch(getMarketAsync());
  }, []);

  const onSubmit = handleSubmit(async (data: any) => {
    try {
      const payload: ProjectRequest = {
        ...data,
      };
      if (!currentProject) {
        const response = await dispatch(addProjectAsync(payload));
        if (response.meta.requestStatus === 'fulfilled') {
          toast.success('Add project successfully!');
          reset();
          onClose(true);
        }
      } else {
        const response = await dispatch(updateProjectAsync(payload));
        if (response.meta.requestStatus === 'fulfilled') {
          toast.success('Update project successfully!');
          reset();
          onClose(true);
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
      onClose={() => onClose()}
      PaperProps={{ sx: { maxWidth: 720 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{currentProject ? 'Update Project' : 'Create Project'}</DialogTitle>

        <DialogContent>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            sx={{ my: 1 }}
          >
            <Field.Text
              rules={{
                required: {
                  value: true,
                  message: 'Name is required.',
                },
              }}
              name="name"
              label="Name"
            />
            <Field.Select
              rules={{
                required: 'Status is required.',
              }}
              name="status"
              label="Status"
              disabled={!currentProject}
            >
              {PROJECT_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
            <Field.Text
              rules={{
                required: {
                  value: true,
                  message: 'Client name is required.',
                },
              }}
              name="clientName"
              label="Client name"
            />
            <Field.Select
              rules={{
                required: 'Type is required.',
              }}
              name="type"
              label="Type"
            >
              <MenuItem value="">-- Select --</MenuItem>
              {PROJECT_TYPE_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>
            <Field.Text name="business" label="Business" />
            <Field.Text name="technologies" label="Technologies" />
            <Field.DatePicker
              rules={{ required: 'Start Date is required' }}
              name="startDate"
              label="Start Date"
            />
            <Field.DatePicker
              rules={{ required: 'End Date is required' }}
              name="endDate"
              label="End Date"
            />
            <Field.Text name="communicationChannels" label="Communication Channels" />
            <Field.Text name="notes" label="Notes" />
            <Field.Select name="market" label="Market">
              {markets.map((market: any) => (
                <MenuItem key={market.id} value={market.id}>
                  {market.name}
                </MenuItem>
              ))}
            </Field.Select>
            <Field.Select name="department" label="Department">
              {departments.map((department: any) => (
                <MenuItem key={department.id} value={department.id}>
                  {department.name}
                </MenuItem>
              ))}
            </Field.Select>
            {currentProject && (
              <>
                <Field.Autocomplete
                  name="projectManager"
                  label="Project Manager"
                  options={employees}
                  getOptionLabel={(option: any) => option.fullName}
                  renderOptions={(props: any, option: any) => (
                    <li {...props} value={option.id} key={option.id}>
                      {option.fullName}
                    </li>
                  )}
                />
                <Field.Autocomplete
                  name="accountManager"
                  label="Account Manager"
                  getOptionLabel={(option: any) => option.fullName}
                  options={employees}
                  renderOptions={(props: any, option: any) => (
                    <li {...props} value={option.id} key={option.id}>
                      {option.fullName}
                    </li>
                  )}
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              onClose();
              reset();
            }}
          >
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {currentProject ? 'Update' : 'Create'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
