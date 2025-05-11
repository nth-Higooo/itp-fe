import { Checkbox, IconButton, TableCell, TableRow, Tooltip, useTheme } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { UserPermission } from 'src/data/auth/role.model';
import { EmployeeSkill } from 'src/data/skill/skill.model';
import TokenService from 'src/services/token.service';

export type TSkillTableRow = {
  row: EmployeeSkill;
  onEditRow: () => void;
  onDeleteRow: () => void;
};

export function EmployeeSkillTableRow({ row, onEditRow, onDeleteRow }: TSkillTableRow) {
  const isMainSkill = row.isMainSkill;
  const theme = useTheme();

  return (
    <>
      <TableRow
        hover
        tabIndex={-1}
        sx={{
          bgcolor: isMainSkill
            ? theme.palette.mode === 'dark'
              ? '#00695c'
              : '#e0f2f1'
            : 'inherit',
        }}
      >
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.skillLevel.skillType.skillName}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.skillLevel.skillType.name}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.skillLevel.level}</TableCell>
        <TableCell>
          {TokenService.getPermissions().some(
            (p) => p.permission === UserPermission.SKILL_MANAGEMENT && p.canUpdate
          ) && (
            <Tooltip title="Edit" placement="top" arrow>
              <IconButton color="default" onClick={onEditRow}>
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip>
          )}
          {TokenService.getPermissions().some(
            (p) => p.permission === UserPermission.SKILL_MANAGEMENT && p.canDelete
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
