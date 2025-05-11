import Box from '@mui/material/Box';
import { EmployeeTabCommon } from './employee-tab-common';
import { EmployeeTabGovernment } from './employee-tab-government';
import { EmployeeTabBank } from './employee-tab-bank';
import { OnboardingEmployee } from 'src/data/employee/onboarding.model';
import { EmployeeTabEmergency } from './employee-tab-emergency';
import { EmployeeTabDetail } from './employee-tab-detail';
import { EmployeeTabOthers } from './employee-tab-others';
import { EmployeeTabSkills } from './employee-skills/employee-tab-skills';
import { EmployeeEducationsView } from './employee-education/view';

// ----------------------------------------------------------------------

export type EmployeeTabProps = {
  currentEmployee?: OnboardingEmployee;
  canEdit?: boolean;
  role?: 'Employee' | 'Employer';
};

export function EmployeeTabGeneral({ currentEmployee, canEdit, role }: EmployeeTabProps) {
  return (
    <Box display="flex" gap={5} flexDirection="column">
      <EmployeeTabCommon currentEmployee={currentEmployee} canEdit={role === 'Employer'} />

      {currentEmployee?.id && (
        <>
          <EmployeeTabDetail currentEmployee={currentEmployee} canEdit={canEdit} role={role} />

          <EmployeeEducationsView EmployeeID={currentEmployee?.id} />

          <EmployeeTabSkills currentEmployee={currentEmployee} canEdit={canEdit} role={role} />

          <EmployeeTabGovernment currentEmployee={currentEmployee} canEdit={canEdit} role={role} />

          <EmployeeTabBank currentEmployee={currentEmployee} canEdit={canEdit} role={role} />

          <EmployeeTabEmergency currentEmployee={currentEmployee} canEdit={canEdit} role={role} />

          <EmployeeTabOthers currentEmployee={currentEmployee} canEdit={canEdit} role={role} />
        </>
      )}
    </Box>
  );
}
