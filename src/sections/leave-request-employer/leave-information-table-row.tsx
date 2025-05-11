import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { usedLeave } from 'src/data/leave/leave.model';
import { useCallback } from 'react';
import { Department } from 'src/data/employer/department.model';
import { Box, Chip, IconButton, Tooltip } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { UpdateRemainingAnnualLeaveForm } from './leave-information-update-remaining-leave-form';
import { useBoolean } from 'src/hooks/use-boolean';

// ----------------------------------------------------------------------

export type TLeaveInformationTableRowProps = {
  refreshFunction: any;
  row: {
    id: string;
    fullName: string;
    departments: Department[];
    totalAnnualLeave: number;
    remainingAnnualLeave: number;
    usedLeaves: usedLeave[];
  };
};

export function LeaveInformationTableRow({ row, refreshFunction }: TLeaveInformationTableRowProps) {
  const isEdit = useBoolean(false);
  const renderDepartmentNames = useCallback(
    (departments: Department[]) => {
      return (
        <Box display="flex" gap={1}>
          {departments.map((department: Department) => {
            return (
              <Chip
                key={department.id}
                variant="filled"
                color={'default'}
                label={department.name}
              />
            );
          })}
        </Box>
      );
    },
    [row.id]
  );

  const renderUsedLeaves = useCallback(
    (usedLeaves: usedLeave[]) => {
      return (
        <Box display="flex" gap={1}>
          {usedLeaves.map((usedLeave: usedLeave, key: number) => {
            return (
              <Stack
                key={usedLeave.employeeId}
                sx={{
                  typography: 'body2',
                  flex: '1 1 auto',
                  alignItems: 'flex-start',
                }}
              >
                {usedLeave.leaveTypeName} : {usedLeave.totalLeaveDays}
              </Stack>
            );
          })}
        </Box>
      );
    },
    [row.id]
  );

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell>
          <Stack
            sx={{
              typography: 'body2',
              flex: '1 1 auto',
              alignItems: 'flex-start',
            }}
          >
            {row.fullName}
          </Stack>
        </TableCell>
        <TableCell>{renderDepartmentNames(row.departments)}</TableCell>
        <TableCell>
          <Stack
            sx={{
              typography: 'body2',
              flex: '1 1 auto',
              alignItems: 'flex-start',
            }}
          >
            {row.totalAnnualLeave}
          </Stack>
        </TableCell>
        <TableCell>
          <Stack
            sx={{
              typography: 'body2',
              flex: '1 1 auto',
              alignItems: 'flex-start',
            }}
          >
            {row.remainingAnnualLeave}
          </Stack>
        </TableCell>
        <TableCell>{renderUsedLeaves(row.usedLeaves)}</TableCell>
        <TableCell>
          <Tooltip title="Edit Remaining Annual Leave" placement="top" arrow>
            <IconButton color="default" onClick={isEdit.onTrue}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <UpdateRemainingAnnualLeaveForm
        currentEmployee={row}
        open={isEdit.value}
        onClose={isEdit.onFalse}
        refreshFunction={refreshFunction}
      />
    </>
  );
}
