import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function EmployeeTableRow({ row }: any) {
  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar alt={row.name} src={row.photo} />

            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Link color="inherit" sx={{ cursor: 'pointer' }}>
                {row.fullName}
              </Link>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.email}
              </Box>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell>
          {row.departments?.map((department: any, index: number) => (
            <Label key={index} sx={{ my: 1, mx: 1 }} color="warning">
              {department.name}
            </Label>
          ))}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.position}</TableCell>

        <TableCell>
          <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
            <Box component="span" sx={{ whiteSpace: 'nowrap' }}>
              {row.phoneNumber}
            </Box>
            <Box component="span" sx={{ whiteSpace: 'nowrap' }}>
              {row.contactAddress}
            </Box>
          </Stack>
        </TableCell>
      </TableRow>
    </>
  );
}
