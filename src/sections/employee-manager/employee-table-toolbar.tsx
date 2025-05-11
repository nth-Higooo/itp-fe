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
import { Department } from 'src/data/employer/department.model';
import { position_levels } from 'src/data/employer/position.model';
import { Box, Button } from '@mui/material';
import useDebounce from 'src/hooks/use-debounce';

// ----------------------------------------------------------------------

export function EmployeeTableToolbar({
  filters,
  optionsDepartments,
  optionsPositions,
  onResetPage,
}: {
  filters: any;
  optionsDepartments: Department[];
  optionsPositions: position_levels[];
  onResetPage: any;
}) {
  const handleFilterName = (event: any) => {
    setInputValue(event.target.value);
  };

  const [inputValue, setInputValue] = useState('');

  const debouncedValue = useDebounce(inputValue, 500);

  useEffect(() => {
    onResetPage();
    filters.setState({ search: debouncedValue });
  }, [debouncedValue, onResetPage]);

  const handleFilterDepartment = useCallback(
    (event: any) => {
      onResetPage();
      filters.setState({ departmentId: event.target.value });
    },
    [filters, onResetPage]
  );

  const handleFilterPosition = useCallback(
    (event: any) => {
      onResetPage();
      filters.setState({ positionId: event.target.value });
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
          <InputLabel htmlFor="user-filter-role-select-label" shrink={true}>
            Position
          </InputLabel>
          <Select
            value={filters.state.positionId}
            onChange={handleFilterPosition}
            input={<OutlinedInput label="Position" />}
            inputProps={{ id: 'user-filter-role-select-label' }}
            MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
            displayEmpty={true}
            label="Position"
          >
            <MenuItem value="">All</MenuItem>
            {optionsPositions.map((option: any) => (
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
