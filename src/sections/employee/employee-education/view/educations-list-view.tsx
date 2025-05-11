import { Box, Card, Tab, Tabs } from '@mui/material';
import { useTabs } from 'src/hooks/use-tabs';
import { EducationsList } from '../education/employee-education-list';
import { Iconify } from 'src/components/iconify';
import { CertificateList } from '../certificate/employee-certificate-list';
import { AllList } from '../educations-all-list';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';
import { selectEmployees } from 'src/redux/employee/employees.slice';
import { useCallback, useEffect } from 'react';
import {
  deleteEmployeeEducationsAsync,
  getEmployeeEducationsAsync,
} from 'src/services/employee/employee.service';
import { TTheme } from 'src/theme/create-theme';
import { varAlpha } from 'src/theme/styles';
import { ButtonCreate } from 'src/components/button-permission/button-permission';
import { UserPermission } from 'src/data/auth/role.model';
import { toast } from 'sonner';
import { CertificateCreateEditForm } from '../certificate/certificate-create-edit-from';
import { EducationCreateEditForm } from '../education/education-create-edit-form';

const OPTIONS = [
  { value: 'ALL', label: 'All' },

  { value: 'EDUCATION', label: 'Education', icon: <Iconify icon="solar:book-2-bold-duotone" /> },
  {
    value: 'CERTIFICATE',
    label: 'Certificate',
    icon: <Iconify icon="solar:medal-ribbons-star-bold-duotone" />,
  },
];
//------------------------------------------------
interface EducationsListViewProps {
  EmployeeID: string;
}

export function EducationsListView({ EmployeeID }: EducationsListViewProps) {
  const tabs = useTabs('ALL');
  const dispatch = useAppDispatch();
  const createEdu = useBoolean();
  const createCerti = useBoolean();
  const isLoading = useBoolean();

  const filters = useSetState({
    employeeId: String(EmployeeID),
    type: 'ALL',
  });
  const { educationsList } = useAppSelector(selectEmployees);

  const handleFilterStatus = useCallback(
    (even: any, newValue: any) => {
      tabs.setValue(newValue);
      filters.setState({ ...filters.state, type: String(newValue) });
    },
    [filters]
  );

  const fetchDataList = async () => {
    isLoading.onTrue();
    await dispatch(
      getEmployeeEducationsAsync({
        ...filters.state,
      })
    );
    isLoading.onFalse();
  };

  const handleDeleteRow = async (id: string) => {
    const response = await dispatch(deleteEmployeeEducationsAsync(id));
    if (response.meta.requestStatus === 'fulfilled') {
      toast.error('Delete education successfully!');
    }
    fetchDataList();
  };

  useEffect(() => {
    fetchDataList();
  }, [filters.state]);
  return (
    <Card variant="outlined" sx={{ p: 3, m: 2, height: 'max-content' }}>
      <Box display="flex" justifyContent="flex-end" sx={{ gap: 2, mb: 2 }}>
        <ButtonCreate
          permission={UserPermission.EMPLOYEE_MANAGEMENT}
          label="New Certificate"
          props={{
            variant: 'contained',
            color: 'primary',
            startIcon: <Iconify icon="mdi:plus" />,
            onClick: () => createCerti.onTrue(),
          }}
        />
        <CertificateCreateEditForm
          open={createCerti.value}
          onClose={() => {
            createCerti.onFalse();
          }}
          employeeId={EmployeeID}
          fetchDataList={fetchDataList}
        />
        <ButtonCreate
          permission={UserPermission.EMPLOYEE_MANAGEMENT}
          label="New Education"
          props={{
            variant: 'contained',
            color: 'primary',
            startIcon: <Iconify icon="mdi:plus" />,
            onClick: () => createEdu.onTrue(),
          }}
        />
        <EducationCreateEditForm
          open={createEdu.value}
          onClose={() => {
            createEdu.onFalse();
          }}
          employeeId={EmployeeID}
          fetchDataList={fetchDataList}
        />
      </Box>
      <Tabs
        value={tabs.value}
        onChange={handleFilterStatus}
        sx={{
          px: 2.5,
          boxShadow: (theme: TTheme) =>
            `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
        }}
      >
        {OPTIONS.map((tab) => (
          <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>
      {tabs.value === 'ALL' && <AllList educationsList={educationsList} isLoading={isLoading} />}

      {tabs.value === 'EDUCATION' && (
        <EducationsList
          employeeId={EmployeeID}
          educationsList={educationsList}
          isLoading={isLoading}
          onDeleteRow={handleDeleteRow}
          fetchDataList={fetchDataList}
        />
      )}

      {tabs.value === 'CERTIFICATE' && (
        <CertificateList
          employeeId={EmployeeID}
          educationsList={educationsList}
          isLoading={isLoading}
          onDeleteRow={handleDeleteRow}
          fetchDataList={fetchDataList}
        />
      )}
    </Card>
  );
}
