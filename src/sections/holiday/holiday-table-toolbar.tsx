import { useCallback, useEffect, useState } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import useDebounce from 'src/hooks/use-debounce';

// ----------------------------------------------------------------------

export function HolidayTableToolbar({ filters, options, onResetPage }: any) {
  const handleFilterName = (event: any) => {
    setInputValue(event.target.value); // Update local state with input value
  };

  const [inputValue, setInputValue] = useState('');

  const debouncedValue = useDebounce(inputValue, 500);

  useEffect(() => {
    onResetPage();
    filters.setState({ searchName: debouncedValue });
  }, [debouncedValue, onResetPage]);

  const handleFilterYear = useCallback(
    (event: any) => {
      filters.setState({ year: event.target.value });
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
          <InputLabel id="user-filter-role-select-label" shrink={true}>
            Year
          </InputLabel>
          <Select
            MenuProps={{ PaperProps: { sx: { maxHeight: 260 } } }}
            labelId="holiday-filter-year-select-label"
            onChange={handleFilterYear}
            displayEmpty
            label="Year"
            value={filters.state.year || ''}
          >
            <MenuItem value="">All</MenuItem>
            {options.years.map((option: any) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          value={inputValue}
          onChange={handleFilterName}
          placeholder="Search by name..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        {filters.state.searchName && (
          <Box flexGrow={1} gap={1} display="flex" flexWrap="wrap" alignItems="center">
            <Button
              color="error"
              onClick={() => {
                const currentYear = new Date().getFullYear();
                filters.setState({ searchName: '', year: `${currentYear}` });
                setInputValue('');
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
