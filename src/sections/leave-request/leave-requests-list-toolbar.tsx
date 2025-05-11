import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Box, Button } from '@mui/material';
import { Iconify } from 'src/components/iconify';


// ----------------------------------------------------------------------


export function LeaveRequestsListTableToolbar({ filters, LeaveOptions ,onResetPage }: any) {
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let i = currentYear -5 ; i <= currentYear; i++) {
      yearOptions.push(i);
    }
    return yearOptions;
  }
  
  const handleFilterYear = useCallback(
    (event: any) => {
      onResetPage();
      filters.setState({ year: event.target.value });
    },
    [filters, onResetPage]
  );
  const handleFilterLeaveType = useCallback(
    (event: any) => {
      onResetPage();
      filters.setState({ leaveTypeId: event.target.value });
    },
    [filters, onResetPage]
  );

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 2.5 }}
      >
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 260 } }}>
          <InputLabel htmlFor="user-filter-role-select-label" shrink={true}>Year</InputLabel>
          <Select
            value={filters.state.year}
            onChange={handleFilterYear}
            input={<OutlinedInput label="Year" />}
            inputProps={{ id: 'user-filter-role-select-label' }}
            MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
            displayEmpty = {true}
          >
            <MenuItem value="">All</MenuItem> 
            {generateYearOptions().map((option: any) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 260 } }}>
          <InputLabel htmlFor="user-filter-role-select-label" shrink={true}>Leave Type</InputLabel>
          <Select
            value={filters.state.leaveTypeId}
            onChange={handleFilterLeaveType}
            input={<OutlinedInput label="Leave Type" />}
            inputProps={{ id: 'user-filter-role-select-label' }}
            MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
            displayEmpty = {true}
          >
            <MenuItem value="">All</MenuItem> 
            {LeaveOptions?.map((option: any) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {(filters.state.year || filters.state.leaveTypeId) && (
            <Box flexGrow={1} gap={1} display="flex" flexWrap="wrap" alignItems="center">
              <Button
                color="error"
                onClick={() => {
                  filters.setState({
                    year: '',
                    leaveTypeId: '',
                  });
                }}
                startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              >
                Clear
              </Button>
            </Box>
          )}
        </Stack>
    </>
  );
}
