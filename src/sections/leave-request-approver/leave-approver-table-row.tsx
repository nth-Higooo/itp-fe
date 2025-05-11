import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { Label } from 'src/components/label';
import { LeaveType } from 'src/data/leave/leave.model';
import { Employee } from 'src/data/employee/employee.model';
import { Avatar, Box, IconButton, Link, Tooltip } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import dayjs from 'dayjs';
import { useBoolean } from 'src/hooks/use-boolean';
import { LeaveApproverEditForm } from './leave-approver-edit-form';
import { useAppSelector } from 'src/redux/store';
import { selectLeave } from 'src/redux/leave/leave.slice';

// ----------------------------------------------------------------------

export type TLeaveRequestTableRowProps = {
  refreshFunction: () => void;
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
    updateAt?: string;
  };
};

export function LeaveApproverTableRow({ row, refreshFunction }: TLeaveRequestTableRowProps) {
  const { selectedLeaveRequest } = useAppSelector(selectLeave);

  const bgColor = selectedLeaveRequest === row.id ? '#fff179' : 'inherit';

  const startDate = row.startDate ? new Date(row.startDate) : null;
  const endDate = row.endDate ? new Date(row.endDate) : null;
  const quickEdit = useBoolean();

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

  const handleClose = () => {
    quickEdit.onFalse();
  };

  return (
    <>
      <TableRow sx={{ bgcolor: bgColor }} hover tabIndex={-1}>
        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar alt={row.employee.fullName} src={row.employee.photo} />
            <Link color="inherit" sx={{ cursor: 'pointer' }}>
              {row.employee.fullName}
            </Link>
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
        {row.status === 'Pending' ? (
          <TableCell>
            <Tooltip title="Edit" placement="top" arrow>
              <IconButton
                color={quickEdit.value ? 'inherit' : 'default'}
                onClick={quickEdit.onTrue}
              >
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip>
          </TableCell>
        ) : (
          <TableCell></TableCell>
        )}
      </TableRow>

      <LeaveApproverEditForm
        currentRequest={row}
        onRefresh={refreshFunction}
        open={quickEdit.value}
        onClose={handleClose}
      />
    </>
  );
}
