import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

import { getPermissions } from 'src/services/token.service';
import { UserPermission } from 'src/data/auth/role.model';

// ----------------------------------------------------------------------

export type TableRowProps = {
  row: any;
  selected: boolean;
  onEditRow: () => void;
  onDeleteRow: () => void;
};

export function MarketTableRow({ row, selected, onEditRow, onDeleteRow }: TableRowProps) {
  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
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
        <TableCell>{row.description}</TableCell>
        {getPermissions().find((p) => p.permission === UserPermission.MARKET_MANAGEMENT)
          ?.canCreate ? (
          <TableCell>
            <Stack direction="row" alignItems="center" justifyContent="flex-end">
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
          </TableCell>
        ) : (
          <TableCell></TableCell>
        )}
      </TableRow>
    </>
  );
}
