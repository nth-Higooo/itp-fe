import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { useBoolean } from 'src/hooks/use-boolean';

// ----------------------------------------------------------------------

export type THolidayTableRowProps = {
  row: {
    id: string;
    name: string;
    startDate: string | null;
    endDate: string | null;
  };
  selected: boolean;
  onSelectRow: () => void;
  onDeleteRow: () => void;
};

export function HolidayTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
}: THolidayTableRowProps) {
  const startDate = row.startDate ? new Date(row.startDate) : null;
  const endDate = row.endDate ? new Date(row.endDate) : null;

  const dateRange = (
    <span>
      <Label variant="soft" color="success">
        {startDate ? startDate.toLocaleDateString('en-GB') : 'N/A'}
      </Label>
      {'   -   '}
      <Label variant="soft" color="error">
        {endDate ? endDate.toLocaleDateString('en-GB') : 'N/A'}
      </Label>
    </span>
  );
  const confirm = useBoolean();

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
            }}
          >
            {row.name}
          </Stack>
        </TableCell>

        <TableCell>
          <Stack
            sx={{
              typography: 'body2',
              flex: '1 1 auto',
              alignItems: 'flex-start',
            }}
          >
            {dateRange}
          </Stack>
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" justifyContent="flex-end">
            <Tooltip title="Delete" placement="top" arrow>
              <IconButton color="error" onClick={onDeleteRow}>
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow>
    </>
  );
}
