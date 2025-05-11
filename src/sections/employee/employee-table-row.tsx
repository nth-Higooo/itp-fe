import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { UserStatus } from 'src/data/auth/user.model';

// ----------------------------------------------------------------------

export function EmployeeTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onResendRow,
  onRestoreRow,
  onPermanentlyDeleteRow,
}: any) {
  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox id={row.id} checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar alt={row.name} src={row.photo} />

            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Link color="inherit" onClick={onEditRow} sx={{ cursor: 'pointer' }}>
                {row.fullName}
              </Link>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.email}
              </Box>
            </Stack>
          </Stack>
        </TableCell>
        <TableCell>
          {row.departments?.map((dept: any, index: number) => (
            <Label key={index} sx={{ my: 1, mr:2 }}>
              {dept.name}
            </Label>
          ))}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.position}</TableCell>
        {row.contracts.length ? (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.contracts[0].workingType}</TableCell>
        ) : (
          <TableCell sx={{ whiteSpace: 'nowrap' }}></TableCell>
        )}
        {row.contracts.length ? (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.contracts[0].contractType}</TableCell>
        ) : (
          <TableCell sx={{ whiteSpace: 'nowrap' }}></TableCell>
        )}

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
