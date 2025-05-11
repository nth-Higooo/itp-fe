import { useCallback } from 'react';
import Stack from '@mui/material/Stack';
import { Iconify } from 'src/components/iconify';
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

// ----------------------------------------------------------------------

export function LeaveRequestTableToolbar({ filters, typeOptions, onResetPage, exportPage }: any) {
  const handleFilterMonth = useCallback(
    (event: any) => {
      onResetPage();
      filters.setState({ month: event.target.value });
    },
    [filters, onResetPage]
  );

  const handleFilterType = useCallback(
    (event: any) => {
      onResetPage();
      filters.setState({ leaveTypeId: event.target.value });
    },
    [filters, onResetPage]
  );

  // Define the 12 months manually
  const monthOptions = [
    { id: '01', name: 'January' },
    { id: '02', name: 'February' },
    { id: '03', name: 'March' },
    { id: '04', name: 'April' },
    { id: '05', name: 'May' },
    { id: '06', name: 'June' },
    { id: '07', name: 'July' },
    { id: '08', name: 'August' },
    { id: '09', name: 'September' },
    { id: '10', name: 'October' },
    { id: '11', name: 'November' },
    { id: '12', name: 'December' },
  ];

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5 }}
    >
      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 260 } }}>
        <InputLabel id="user-filter-role-select-label" shrink={true}>
          Leave Type
        </InputLabel>
        <Select
          MenuProps={{ PaperProps: { sx: { maxHeight: 260 } } }}
          labelId="leave-request-filter-status-select-label"
          onChange={handleFilterType}
          displayEmpty
          label="Leave Type"
          value={filters.state.leaveTypeId || ''}
        >
          <MenuItem value="">All</MenuItem>
          {typeOptions?.map((option: any) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 260 } }}>
        <InputLabel id="user-filter-role-select-label" shrink={true}>
          Month
        </InputLabel>
        <Select
          MenuProps={{ PaperProps: { sx: { maxHeight: 260 } } }}
          labelId="leave-request-filter-month-select-label"
          onChange={handleFilterMonth}
          displayEmpty
          label="Month"
          value={filters.state.month || ''}
        >
          <MenuItem value="">All</MenuItem>
          {monthOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}
