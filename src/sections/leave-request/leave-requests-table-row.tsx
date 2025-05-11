import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';
import dayjs from 'dayjs';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function LeaveRequestListTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  currentRequestId,
}: any) {
  const startDate = row.startDate ? new Date(row.startDate) : null;
  const endDate = row.endDate ? new Date(row.endDate) : null;
  const bgColor = currentRequestId === row.id ? '#fff179' : 'inherit';

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
          {' ('}
          {startDate?.toLocaleTimeString('en-GB')}
          {') '}
          {'   -   '}
          {endDate ? endDate.toLocaleDateString('en-GB') : 'N/A'}
          {' ('}
          {endDate?.toLocaleTimeString('en-GB')}
          {') '}
        </>
      )}
    </span>
  );
  return (
    <>
      <TableRow sx={{ bgcolor: bgColor }} hover tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox id={row.id} checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              {row.leaveType?.name}
            </Stack>
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
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.numberOfDays}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.reason}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.comment}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.approver.fullName}</TableCell>
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
          {row.status === 'Pending' && (
            <Stack direction="row" alignItems="center">
              <Tooltip title="Delete" placement="top" arrow>
                <IconButton color="error" onClick={onDeleteRow}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
        </TableCell>
      </TableRow>
    </>
  );
}
