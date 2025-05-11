import {
  Box,
  Button,
  Checkbox,
  Chip,
  IconButton,
  Stack,
  SvgIcon,
  TableCell,
  TableRow,
  Tooltip,
  useTheme,
} from '@mui/material';
import { useCallback } from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Iconify } from 'src/components/iconify';
import { UserPermission } from 'src/data/auth/role.model';
import { SkillLevel } from 'src/data/skill/skill.model';
import { useBoolean } from 'src/hooks/use-boolean';
import { getPermissions } from 'src/services/token.service';

export type TableRowProps = {
  row: any;
  selected: boolean;
  onEditRow: () => void;
  onDeleteRow: () => void;
  onToggleExpand?: () => void;
  isExpanded?: boolean;
  isChild?: boolean;
  onSelectRow: (id: string, isChild: boolean) => void;
};

export function SkillTypeTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onToggleExpand,
  isExpanded,
  isChild = false,
}: TableRowProps) {
  const confirm = useBoolean();
  const theme = useTheme();

  const renderLevelsNames = useCallback(
    (levels: SkillLevel[]) => {
      return (
        <Box display="flex" gap={1}>
          {levels?.map((level: SkillLevel) => (
            <Chip
              key={level.id}
              variant="filled"
              sx={{
                bgcolor: theme.palette.mode === 'dark' ? '#dcedc8' : '#009688',
              }}
              label={level.level}
            />
          ))}
        </Box>
      );
    },
    [row.id]
  );

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
          <Checkbox id={row.id} checked={selected} onClick={() => onSelectRow(row.id, isChild)} />
        </TableCell>
        <TableCell>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              pl: isChild ? 5 : 0,
            }}
          >
            <Stack
              sx={{
                typography: 'body2',
                flex: '1 1 auto',
                alignItems: 'flex-start',
                color: isChild ? 'text.primary' : 'inherit', // Lighter color for child
                fontSize: isChild ? '0.875rem' : '1rem', // Smaller font for child
              }}
            >
              {isChild ? row.skillName : row.name}
            </Stack>
            {row.skillNames && row.skillNames.length > 0 && !isChild && (
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
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{renderLevelsNames(row.levels)}</TableCell>

        {getPermissions().find((p) => p.permission === UserPermission.SKILL_TYPE_MANAGEMENT)
          ?.canCreate ? (
          <TableCell>
            <Stack direction="row" alignItems="center" justifyContent="flex-end">
              <Tooltip title="Edit" placement="top" arrow>
                <IconButton color="default" onClick={onEditRow}>
                  <Iconify icon="solar:pen-bold" />
                </IconButton>
              </Tooltip>
            </Stack>
          </TableCell>
        ) : (
          <TableCell></TableCell>
        )}
      </TableRow>

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
