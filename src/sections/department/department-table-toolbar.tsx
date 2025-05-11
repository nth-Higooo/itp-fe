import { useEffect, useState } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { Box, Button, Chip } from '@mui/material';
import useDebounce from 'src/hooks/use-debounce';

// ----------------------------------------------------------------------

export function DepartmentTableToolbar({ filters, onResetPage, employeeQuantity }: any) {
  const handleFilterName = (event: any) => {
    setInputValue(event.target.value); // Update local state with input value
  };

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
        <Box sx={{ position: 'relative' }}>
          <Chip variant="filled" color="default" label={`Total employees: ${employeeQuantity}`} />
        </Box>
        <TextField
          fullWidth
          value={inputValue}
          onChange={handleFilterName}
          placeholder="Search for department by name..."
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
      </Stack>
    </>
  );
}
