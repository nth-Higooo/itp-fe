import { TableCell, TableRow } from '@mui/material';

export function AllEducationsTableRow({ row }: any) {
  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell sx={{ whiteSpace: 'wrap' }}>
          {row.certificateName || `${row.degree.name} of ${row.major}`}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'wrap' }}>{row.certificateWebsite || row.school}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {row.certificateName ? row.toYear : `${row.fromYear} - ${row.toYear}`}
        </TableCell>
      </TableRow>
    </>
  );
}
