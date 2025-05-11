import { useEffect, useState } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import useDebounce from 'src/hooks/use-debounce';
import { Box, Button } from '@mui/material';

// ----------------------------------------------------------------------

export function PositionTableToolbar({ filters, onResetPage }: any) {
  const handleFilterName = (event: any) => {
    setInputValue(event.target.value); // Update local state with input value
  };

  const [inputValue, setInputValue] = useState('');

  const debouncedValue = useDebounce(inputValue, 500);

  useEffect(() => {
    onResetPage();
    filters.setState({ searchName: debouncedValue });
  }, [debouncedValue, onResetPage]);

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 2.5 }}
      >
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
        {filters.state.searchName && (
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
