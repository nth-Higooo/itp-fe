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

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { PositionCreateEditForm } from './position-create-edit-form';
import { useCallback } from 'react';
import { Chip } from '@mui/material';
import { position_levels } from 'src/data/employer/position.model';
import { getPermissions } from 'src/services/token.service';
import { UserPermission } from 'src/data/auth/role.model';

// ----------------------------------------------------------------------

export function PositionTableRow({ row, selected, onSelectRow, onDeleteRow }: any) {
  const confirm = useBoolean();
  const quickEdit = useBoolean();

  const renderLevelsNames = useCallback(
    (levels: position_levels[]) => {
      return (
        <Box display="flex" flexWrap="wrap" sx={{width: 800}}>
          {levels.map((level: any) => {
            return <Chip sx={{m: 1}} key={level.id} variant="filled" color={'info'} label={level.level} />;
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
        <Stack
              sx={{
                typography: 'body2',
                flex: '1 1 auto',
                alignItems: 'flex-start',
                color: 'inherit', // Lighter color for child
                fontSize: '1rem', // Smaller font for child
              }}
            >
              {row.name}
            </Stack>
        </TableCell>
        <TableCell>{renderLevelsNames(row.levels)}</TableCell>
        {getPermissions().find((p) => p.permission === UserPermission.POSITION_MANAGEMENT)
          ?.canUpdate ? (
          <TableCell>
            <Stack direction="row" alignItems="center">
              <Tooltip title="Edit" placement="top" arrow>
                <IconButton
                  color={quickEdit.value ? 'inherit' : 'default'}
                  onClick={quickEdit.onTrue}
                >
                  <Iconify icon="solar:pen-bold" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete" placement="top" arrow>
                <IconButton color="error" onClick={confirm.onTrue}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Tooltip>
            </Stack>
          </TableCell>
        ) : (
          <TableCell></TableCell>
        )}
      </TableRow>

      <PositionCreateEditForm
        currentPosition={row}
        open={quickEdit.value}
        onClose={quickEdit.onFalse}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
