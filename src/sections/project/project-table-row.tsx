import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { ProjectStatus, ProjectType } from 'src/data/project';
import { useCallback } from 'react';
import { PROJECT_STATUS_OPTIONS, PROJECT_TYPE_OPTIONS } from './project-create-edit-form';
import dayjs from 'dayjs';

// ----------------------------------------------------------------------
export type TProjectTableRowProps = {
  row?: any;
  selected?: any;
  onSelectRow?: any;
  onEditRow?: any;
  onDeleteRow?: any;
  onRestoreRow?: any;
  onPermanentlyDeleteRow?: any;
};

export function ProjectTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onDeleteRow,
  onRestoreRow,
  onPermanentlyDeleteRow,
}: TProjectTableRowProps) {
  const renderType = useCallback(
    (rowType: string) => {
      const result = PROJECT_TYPE_OPTIONS.find((item) => item.value === rowType);
      return (
        <Label
          variant="soft"
          color={
            (rowType === ProjectType.ODC && 'success') ||
            (rowType === ProjectType.PROJECT_BASED && 'warning') ||
            (rowType === ProjectType.TIME_MATERIAL && 'error') ||
            'default'
          }
        >
          {result?.label || rowType}
        </Label>
      );
    },
    [row.id]
  );
  const renderStatus = useCallback(
    (rowStatus: string) => {
      const result = PROJECT_STATUS_OPTIONS.find((item) => item.value === rowStatus);
      return (
        <Label
          variant="soft"
          color={
            (rowStatus === ProjectStatus.INITIAL && 'success') ||
            (rowStatus === ProjectStatus.EVALUATION && 'warning') ||
            (rowStatus === ProjectStatus.END && 'error') ||
            'default'
          }
        >
          {result?.label || rowStatus}
        </Label>
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

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.name}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.department?.name}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {dayjs(row.startDate).format('DD-MM-YYYY')}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {dayjs(row.endDate).format('DD-MM-YYYY')}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.clientName}</TableCell>

        <TableCell>{renderType(row.type)}</TableCell>

        <TableCell>{renderStatus(row.status)}</TableCell>

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
