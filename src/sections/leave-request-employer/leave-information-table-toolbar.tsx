import { useCallback, useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import { Iconify } from 'src/components/iconify';
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import useDebounce from 'src/hooks/use-debounce';

// ----------------------------------------------------------------------

export function LeaveInformationTableToolbar({ filters, onResetPage }: any) {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, index) => currentYear - index);

  const [inputValue, setInputValue] = useState('');
  const debouncedValue = useDebounce(inputValue, 500);

  const handleFilterName = (event: any) => {
    setInputValue(event.target.value);
  };

  const handleFilterYear = useCallback(
    (event: any) => {
      onResetPage();
      filters.setState({ year: event.target.value });
    },
    [filters, onResetPage]
  );

  useEffect(() => {
    onResetPage();
    filters.setState({ search: debouncedValue });
  }, [debouncedValue, onResetPage]);

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5 }}
    >
      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 260 } }}>
        <InputLabel id="leave-information-filter-year-select-label" shrink={true}>
          Year
        </InputLabel>
        <Select
          MenuProps={{ PaperProps: { sx: { maxHeight: 260 } } }}
          labelId="leave-information-filter-year-select-label"
          onChange={handleFilterYear}
          displayEmpty
          label="Year"
          value={filters.state.year || currentYear}
        >
          {yearOptions.map((year: number) => (
            <MenuItem key={year} value={year}>
              {year}
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

      {filters.state.search && (
        <Box flexGrow={1} gap={1} display="flex" flexWrap="wrap" alignItems="center">
          <Button
            color="error"
            onClick={() => {
              filters.onResetState();
              setInputValue('');
            }}
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          >
            Clear
          </Button>
        </Box>
      )}

      <Box sx={{ flexGrow: 1 }} />
    </Stack>
  );
}
