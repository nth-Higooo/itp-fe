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

import { ContractCreateEditForm } from './contract-create-edit-form';
import { getPermissions, getSession } from 'src/services/token.service';
import { UserPermission } from 'src/data/auth/role.model';

// ----------------------------------------------------------------------

export function ContractTableRow({ row, rowEmployee, resetFunction }: any) {
  const confirm = useBoolean();

  const quickEdit = useBoolean();

  return (
    <>
      <TableRow>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Stack spacing={2} direction="row" alignItems="center">
          <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
          {row.contractNumber}
          </Stack>
        </Stack>
        </TableCell>

        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              {row.employeeFullName}
            </Stack>
          </Stack>
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.startDate}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.endDate}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.workingType}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.contractType}</TableCell>
        {row.isRemote === true ? (
          <TableCell sx={{ whiteSpace: 'nowrap' }}><Iconify sx={{ml:'25%'}} color="green" icon='mdi:tick-circle'/></TableCell>
        ):(
          <TableCell sx={{ whiteSpace: 'nowrap' }}><Iconify sx={{ml:'25%'}} color="grey" icon='mdi:cross-circle'/></TableCell>
        )}


        <TableCell>
          <Label
            variant="soft"
            color={
              (row.status === 'Active' && 'success') ||
              (row.status === 'Expired' && 'warning') ||
              (row.status === 'Terminated' && 'error') ||
              'default'
            }
          >
            {row.status}
          </Label>
        </TableCell>
        {getPermissions().find((p) => p.permission === UserPermission.CONTRACT_MANAGEMENT)
          ?.canUpdate && getSession().employeeId !== row.employeeId ? (
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
          </Stack>
        </TableCell>
          ) : (
          <TableCell></TableCell>
        )}
      </TableRow>

      <ContractCreateEditForm
        refreshFunction={resetFunction}
        currentContract={row}
        currentEmployee={rowEmployee}
        open={quickEdit.value}
        onClose={quickEdit.onFalse}
      />
    </>
  );
}
