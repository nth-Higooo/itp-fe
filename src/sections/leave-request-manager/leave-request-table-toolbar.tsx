import { useCallback, useEffect, useState } from 'react';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { Box, Button } from '@mui/material';
import useDebounce from 'src/hooks/use-debounce';

// ----------------------------------------------------------------------

export const optionsStatus = [
  { id: 'All', name: 'All' },
  { id: 'pending', name: 'Pending' },
  { id: 'approved', name: 'Approved' },
  { id: 'rejected', name: 'Rejected' },
];

export const monthOptions = [
  { id: '1', name: '1' },
  { id: '2', name: '2' },
  { id: '3', name: '3' },
  { id: '4', name: '4' },
  { id: '5', name: '5' },
  { id: '6', name: '6' },
  { id: '7', name: '7' },
  { id: '8', name: '8' },
  { id: '9', name: '9' },
  { id: '10', name: '10' },
  { id: '11', name: '11' },
  { id: '12', name: '12' },
];

export function LeaveManagerTableToolbar({
  filters,
  optionsDepartments,
  optionsLeaveTypes,
  onResetPage,
}: any) {
  const handleFilterName = (event: any) => {
    setInputValue(event.target.value);
  };
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
  const handleFilterStatus = useCallback(
    (event: any) => {
      onResetPage();
      filters.setState({ statusId: event.target.value });
    },
    [filters, onResetPage]
  );
  const handleFilterDepartment = useCallback(
    (event: any) => {
      onResetPage();
      filters.setState({ departmentId: event.target.value });
    },
    [filters, onResetPage]
  );

  const [inputValue, setInputValue] = useState('');

  const debouncedValue = useDebounce(inputValue, 500);

  useEffect(() => {
    onResetPage();
    filters.setState({ search: debouncedValue });
  }, [debouncedValue, onResetPage]);

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 2.5 }}
      >
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 260 } }}>
          <InputLabel htmlFor="user-filter-role-select-label" shrink={true}>
            Department
          </InputLabel>
          <Select
            value={filters.state.departmentId}
            onChange={handleFilterDepartment}
            input={<OutlinedInput label="Department" />}
            inputProps={{ id: 'user-filter-role-select-label' }}
            MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
            displayEmpty={true}
            label="Department"
          >
            <MenuItem value="">All</MenuItem>
            {optionsDepartments.map((option: any) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 260 } }}>
          <InputLabel htmlFor="leave-request-filter-leave-type-select-label" shrink={true}>
            Leave Type
          </InputLabel>
          <Select
            value={filters.state.leaveTypeId}
            onChange={handleFilterType}
            input={<OutlinedInput label="Leave Type" />}
            inputProps={{ id: 'leave-request-filter-leave-type-select-label' }}
            MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
            displayEmpty={true}
            label="Leave Type"
          >
            <MenuItem value="">All</MenuItem>
            {optionsLeaveTypes.map((option: any) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 150 } }}>
          <InputLabel htmlFor="leave-request-filter-status-select-label" shrink={true}>
            Status
          </InputLabel>
          <Select
            value={filters.state.status}
            onChange={handleFilterStatus}
            input={<OutlinedInput label="Status" />}
            inputProps={{ id: 'leave-request-filter-status-select-label' }}
            MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
            displayEmpty={true}
            label="Status"
          >
            {optionsStatus.map((option: any) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 80 } }}>
          <InputLabel htmlFor="leave-request-filter-month-select-label" shrink={true}>
            Month
          </InputLabel>
          <Select
            value={filters.state.month}
            onChange={handleFilterMonth}
            input={<OutlinedInput label="Month" />}
            inputProps={{ id: 'leave-request-filter-month-select-label' }}
            MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
            displayEmpty={true}
            label="Month"
          >
            <MenuItem value="">All</MenuItem>
            {monthOptions.map((option: any) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={inputValue}
            onChange={handleFilterName}
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
          {(filters.state.search || filters.state.departmentId || filters.state.positionId) && (
            <Box flexGrow={1} gap={1} display="flex" flexWrap="wrap" alignItems="center">
              <Button
                color="error"
                onClick={() => {
                  filters.setState({
                    search: '',
                    departmentId: '',
                    positionId: '',
                    month: '',
                    status: '',
                    employeeStatus: filters.state.employeeStatus,
                  });
                  setInputValue('');
                }}
                startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              >
                Clear
              </Button>
            </Box>
          )}
        </Stack>
      </Stack>
    </>
  );
}
