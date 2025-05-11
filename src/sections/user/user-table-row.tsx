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

// ----------------------------------------------------------------------
export type TUserTableRowProps = {
  row?: any;
  selected?: any;
  onSelectRow?: any;
  onResendRow?: any;
  onEditRow?: any;
  onDeleteRow?: any;
  onRestoreRow?: any;
  onPermanentlyDeleteRow?: any;
};

export function UserTableRow({
  row,
  selected,
  onSelectRow,
  onResendRow,
  onEditRow,
  onDeleteRow,
  onRestoreRow,
  onPermanentlyDeleteRow,
}: TUserTableRowProps) {
  const renderRoleNames = useCallback(
    (roles: Role[]) => {
      return (
        <Box display="flex" gap={1}>
          {roles.map((role: Role) => {
            return <Chip key={role.id} variant="filled" color={'info'} label={role.name} />;
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

        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar alt={row.name} src={row.avatar} />

            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              {row.displayName}
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.email}
              </Box>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{renderRoleNames(row.roles)}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.status === UserStatus.ACTIVE && 'success') ||
              (row.status === UserStatus.PENDING && 'warning') ||
              (row.status === UserStatus.DISABLED && 'error') ||
              'default'
            }
          >
            {row.status.toLowerCase()}
          </Label>
        </TableCell>

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
