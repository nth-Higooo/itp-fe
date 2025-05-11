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

import { UserStatus } from 'src/data/auth/user.model';

// ----------------------------------------------------------------------
export type TRoleTableRowProps = {
  row?: any;
  selected?: any;
  onSelectRow?: any;
  onDetailsRow?: any;
  onEditRow?: any;
  onDeleteRow?: any;
  onRestoreRow?: any;
  onPermanentlyDeleteRow?: any;
};

export function RoleTableRow({
  row,
  selected,
  onSelectRow,
  onDetailsRow,
  onEditRow,
  onDeleteRow,
  onRestoreRow,
  onPermanentlyDeleteRow,
}: TRoleTableRowProps) {
  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox id={row.id} checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.name}</TableCell>

        <TableCell>{row.description}</TableCell>

        <TableCell>{row.totalUser}</TableCell>

        <TableCell>
          {!!row.deletedAt ? (
            <Stack direction="row" alignItems="center">
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
            <Stack direction="row" alignItems="center">
              <Tooltip title="Permissions" placement="top" arrow>
                <IconButton color="secondary" onClick={onDetailsRow}>
                  <Iconify icon="solar:key-bold" />
                </IconButton>
              </Tooltip>

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
