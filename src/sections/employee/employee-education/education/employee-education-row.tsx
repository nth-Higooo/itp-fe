import { IconButton, TableCell, TableRow, Tooltip } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { UserPermission } from 'src/data/auth/role.model';
import TokenService from 'src/services/token.service';

export function EmployeeEducationTableRow({ row, onDeleteRow, onEditRow }: any) {
  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.degree?.name}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.school}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.major}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {row.fromYear} - {row.toYear}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {TokenService.getPermissions().some(
            (p) => p.permission === UserPermission.EDUCATION_MANAGEMENT && p.canUpdate
          ) && (
            <Tooltip title="Edit" placement="top" arrow>
              <IconButton color="default" onClick={onEditRow}>
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip>
          )}
          {TokenService.getPermissions().some(
            (p) => p.permission === UserPermission.EDUCATION_MANAGEMENT && p.canDelete
          ) && (
            <Tooltip title="Delete" placement="top" arrow>
              <IconButton color="error" onClick={onDeleteRow}>
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
      </TableRow>
    </>
  );
}
