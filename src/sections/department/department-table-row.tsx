import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

import { getPermissions } from 'src/services/token.service';
import { UserPermission } from 'src/data/auth/role.model';
import { SvgIcon, useTheme } from '@mui/material';

// ----------------------------------------------------------------------

export type TDepartmentTableRowProps = {
  row: any;
  selected: boolean;
  onSelectRow: () => void;
  onEditRow: () => void;
  onDeleteRow: () => void;
  onToggleExpand?: () => void;
  isExpanded?: boolean;
  isChild?: boolean;
};

export function DepartmentTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onDeleteRow,
  onToggleExpand,
  isExpanded,
  isChild = false,
}: TDepartmentTableRowProps) {
  const theme = useTheme();
  return (
    <>
      <TableRow
        hover
        selected={selected}
        aria-checked={selected}
        tabIndex={-1}
        sx={{
          bgcolor: isChild ? (theme.palette.mode === 'dark' ? '#263238' : '#eeeeee') : 'inherit',
        }}
      >
        <TableCell padding="checkbox">
          <Checkbox id={row.id} checked={selected} onClick={onSelectRow} />
        </TableCell>
        <TableCell>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              pl: isChild ? 10 : 0,
            }}
          >
            <Stack
              sx={{
                typography: 'body2',
                flex: '1 1 auto',
                alignItems: 'flex-start',
                color: isChild ? 'text.secondary' : 'inherit', // Lighter color for child
                fontSize: isChild ? '0.875rem' : '1rem', // Smaller font for child
              }}
            >
              {row.name}
            </Stack>
            {row.childrenDepartment && row.childrenDepartment.length > 0 && !isChild && (
              <IconButton size="small" onClick={onToggleExpand} sx={{ marginLeft: 2 }}>
                <SvgIcon
                  sx={{
                    width: 16,
                    height: 16,
                    transform: isExpanded ? 'rotate(270deg)' : 'rotate(90deg)',
                    transition: 'transform 0.3s ease',
                  }}
                >
                  <path
                    fill="currentColor"
                    d="M13.83 19a1 1 0 0 1-.78-.37l-4.83-6a1 1 0 0 1 0-1.27l5-6a1 1 0 0 1 1.54 1.28L10.29 12l4.32 5.36a1 1 0 0 1-.78 1.64"
                  />
                </SvgIcon>
              </IconButton>
            )}
          </Box>
        </TableCell>
        <TableCell>
          <Stack
            sx={{
              typography: 'body2',
              flex: '1 1 auto',
            }}
          >
            {row.type || 'No type assigned yet '}
          </Stack>
        </TableCell>

        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            {row.manager?.fullName && (
              <Avatar alt={row.manager?.fullName} src={row.manager?.photo} />
            )}
            <Stack
              sx={{
                typography: 'body2',
                flex: '1 1 auto',
                alignItems: 'flex-start',
                color: row.manager?.fullName ? 'inherit' : 'text.disabled',
              }}
            >
              {row.manager?.fullName || 'No Manager Assigned'}
            </Stack>
          </Stack>
        </TableCell>

        <TableCell>
          <Stack
            sx={{
              typography: 'body2',
              flex: '1 1 auto',
            }}
          >
            {row.employeeQuantity || 0}
          </Stack>
        </TableCell>

        {getPermissions().find((p) => p.permission === UserPermission.DEPARTMENT_MANAGEMENT)
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
