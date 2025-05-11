import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { Role } from 'src/data/auth/role.model';
import { UserStatus } from 'src/data/auth/user.model';
import Chip from '@mui/material/Chip';
import { useCallback } from 'react';
import { NotificationGroupMember } from 'src/data/notification-group/notification-group.model';
import { NOTIFICATION_GROUP_OPTIONS } from './notification-group-create-edit-form';

// ----------------------------------------------------------------------
export type TNotificationGroupTableRowProps = {
  row?: any;
  selected?: any;
  onSelectRow?: any;
  onResendRow?: any;
  onEditRow?: any;
  onDeleteRow?: any;
  onRestoreRow?: any;
  onPermanentlyDeleteRow?: any;
};

export function NotificationGroupTableRow({
  row,
  selected,
  onSelectRow,
  onResendRow,
  onEditRow,
  onDeleteRow,
  onRestoreRow,
  onPermanentlyDeleteRow,
}: TNotificationGroupTableRowProps) {
  const renderMembers = useCallback(
    (members: NotificationGroupMember[]) => {
      return (
        <Box display="flex" gap={1}>
          {members.map((member: NotificationGroupMember) => {
            return <Chip key={member.id} variant="filled" color={'info'} label={member.fullName} />;
          })}
        </Box>
      );
    },
    [row.id]
  );
  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox id={row.id} checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {NOTIFICATION_GROUP_OPTIONS.find((t) => t.value === row.type)?.label}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{renderMembers(row.members)}</TableCell>

        <TableCell>
          {!!row.deletedAt ? (
            <Stack direction="row" alignItems="center" justifyContent="flex-end">
              <Tooltip title="Restore" placement="top" arrow>
                <IconButton color="default" onClick={onRestoreRow}>
                  <Iconify icon="solar:multiple-forward-left-bold" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Permanently Delete" placement="top" arrow>
                <IconButton color="error" onClick={onPermanentlyDeleteRow}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Tooltip>
            </Stack>
          ) : (
            <Stack direction="row" alignItems="center" justifyContent="flex-end">
              {row.status === UserStatus.PENDING && (
                <Tooltip title="Resend" placement="top" arrow>
                  <IconButton color="default" onClick={onResendRow}>
                    <Iconify icon="solar:plain-bold" />
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title="Edit" placement="top" arrow>
                <IconButton color="default" onClick={onEditRow}>
                  <Iconify icon="solar:pen-bold" />
                </IconButton>
              </Tooltip>

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
