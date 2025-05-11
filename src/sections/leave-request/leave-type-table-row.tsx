
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import {Typography } from '@mui/material';



// ----------------------------------------------------------------------

export function LeaveTypeTableRow({row}: any) {
  return (
    <>
      <TableRow tabIndex={-1}>
        {row.name === 'Annual leave' ? (
        <TableCell>
          <Typography sx={{fontSize:'inherit', fontWeight:'bold'}} >
            {row.name} ({row.remaining} remains)    
          </Typography>
        </TableCell>
        ):(<TableCell>
          {row.name}
          </TableCell>
        )}
        <TableCell>{row.regulationQuantity}</TableCell>
      </TableRow>

    </>
  );
}
