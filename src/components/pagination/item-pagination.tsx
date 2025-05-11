
import Box from '@mui/material/Box';
import { FormControlLabel, Switch, TablePagination } from '@mui/material';


// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function PaginationItems({
  sx,
  dense,
  onChangeDense,
  rowsPerPageOptions = [10, 25, 50],
  ...other
}: any) {
  let updatedRowsPerPageOptions = [
    ...rowsPerPageOptions,
    { label: 'All', value: other.count }
  ];
  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <TablePagination
        rowsPerPageOptions={updatedRowsPerPageOptions}
        showLastButton
        showFirstButton
        component="div"
        {...other}
        sx={{ borderTopColor: 'transparent' }}
      />

      {onChangeDense && (
        <FormControlLabel
          label="Dense"
          control={<Switch name="dense" checked={dense} onChange={onChangeDense} />}
          sx={{
            pl: 2,
            py: 1.5,
            top: 0,
            position: { sm: 'absolute' },
          }}
        />
      )}
    </Box>
  );
}