import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { Label } from 'src/components/label';
import { LeaveType } from 'src/data/leave/leave.model';
import { Employee } from 'src/data/employee/employee.model';
import { useCallback } from 'react';
import { Department } from 'src/data/employer/department.model';
import { Avatar, Box, Chip, Link } from '@mui/material';
import dayjs from 'dayjs';

// ----------------------------------------------------------------------

export type TLeaveRequestTableRowProps = {
  row: {
    id: string;
    leaveType: LeaveType;
    startDate: Date | null;
    endDate: Date | null;
    reason: string;
    numberOfDays: string;
    comment?: string;
    status: string;
    employee: Employee;
    approver: Employee;
    updateAt?: string;
  };
};

export function LeaveRequestTableRow({ row }: TLeaveRequestTableRowProps) {
  const renderDepartmentNames = useCallback(
    (departments: Department[]) => {
      return (
        <Box display="flex" gap={1}>
          {departments.map((department: Department) => {
            return (
              <Chip key={department.id} variant="filled" color="info" label={department.name} />
            );
          })}
        </Box>
      );
    },
    [row.id]
  );

  const startDate = row.startDate ? new Date(row.startDate) : null;
  const endDate = row.endDate ? new Date(row.endDate) : null;

  const dateRange = (
    <span>
      {startDate &&
      endDate &&
      startDate.toLocaleDateString('en-GB') === endDate.toLocaleDateString('en-GB') ? (
        <>
          {startDate.toLocaleDateString('en-GB')}
          {' ('}
          {startDate.toLocaleTimeString('en-GB')}
          {'   -   '}
          {endDate.toLocaleTimeString('en-GB')}
          {')'}
        </>
      ) : (
        <>
          {startDate ? startDate.toLocaleDateString('en-GB') : 'N/A'}
          {' ( '}
          {startDate?.toLocaleTimeString('en-GB')}
          {' ) '}
          {'   -   '}
          {endDate ? endDate.toLocaleDateString('en-GB') : 'N/A'}
          {' ( '}
          {endDate?.toLocaleTimeString('en-GB')}
          {' ) '}
        </>
      )}
    </span>
  );

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar alt={row.employee.fullName} src={row.employee.photo} />
            <Link color="inherit" sx={{ cursor: 'pointer' }}>
              {row.employee.fullName}
            </Link>
          </Stack>
        </TableCell>
        <TableCell>{renderDepartmentNames(row.employee.departments)}</TableCell>
        <TableCell>
          <Stack
            sx={{
              typography: 'body2',
              flex: '1 1 auto',
              alignItems: 'flex-start',
            }}
          >
            {row.leaveType?.name}
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
            {dateRange}
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
            {row.numberOfDays}
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
            {row.reason}
          </Stack>
        </TableCell>
        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar alt={row.approver?.fullName} src={row.approver?.photo} />
            <Link color="inherit" sx={{ cursor: 'pointer' }}>
              {row.approver?.fullName}
            </Link>
          </Stack>
        </TableCell>
        <TableCell>
          <Stack
            sx={{
              typography: 'body2',
              flex: '1 1 auto',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            {row.status === 'Pending' ? (
              <Label variant="soft" color={'warning'}>
                {row.status}
              </Label>
            ) : (
              <>
                <Label variant="soft" color={row.status === 'Approved' ? 'success' : 'error'}>
                  {row.status}
                </Label>
                <Box component="span" sx={{ typography: 'caption', color: 'text.disabled' }}>
                  {' at '}
                  {dayjs(row.updateAt).format('HH:mm DD/MM/YYYY')}
                </Box>
              </>
            )}
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
            {row.comment}
          </Stack>
        </TableCell>
      </TableRow>
    </>
  );
}
