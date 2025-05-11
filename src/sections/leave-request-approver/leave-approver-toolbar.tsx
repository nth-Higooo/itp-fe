import { useCallback } from 'react';
import Stack from '@mui/material/Stack';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

// ----------------------------------------------------------------------

export function LeaveApproverTableToolbar({ filters, typeOptions, onResetPage }: any) {
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

  const monthOptions = [
    { id: '1', name: 'January' },
    { id: '2', name: 'February' },
    { id: '3', name: 'March' },
    { id: '4', name: 'April' },
    { id: '5', name: 'May' },
    { id: '6', name: 'June' },
    { id: '7', name: 'July' },
    { id: '8', name: 'August' },
    { id: '9', name: 'September' },
    { id: '10', name: 'October' },
    { id: '11', name: 'November' },
    { id: '12', name: 'December' },
  ];

  return (
    <>
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
            label="huidsfbdfjgbskj"
            value={filters.state.month || ''}
          >
            <MenuItem value="">All</MenuItem>
            {monthOptions.map((option: any) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </>
  );
}
