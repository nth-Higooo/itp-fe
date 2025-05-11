import { useCallback, useEffect, useState } from 'react';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import useDebounce from 'src/hooks/use-debounce';
import { NOTIFICATION_GROUP_OPTIONS } from './notification-group-create-edit-form';

// ----------------------------------------------------------------------

export function NotificationGroupTableToolbar({ filters, onResetPage }: any) {
  const handleFilterName = (event: any) => {
    setInputValue(event.target.value); // Update local state with input value
  };

  const [inputValue, setInputValue] = useState('');

  const debouncedValue = useDebounce(inputValue, 500);

  useEffect(() => {
    onResetPage();
    filters.setState({ memberName: debouncedValue });
  }, [debouncedValue, onResetPage]);

  const handleFilterType = useCallback(
    (event: any) => {
      filters.setState({ type: event.target.value });
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
          <InputLabel id="user-filter-type-select-label" shrink={true}>
            Type
          </InputLabel>
          <Select
            MenuProps={{ PaperProps: { sx: { maxHeight: 260 } } }}
            labelId="user-filter-type-select-label"
            value={filters.state.type}
            onChange={handleFilterType}
            displayEmpty
            label="type"
          >
            <MenuItem value="">All</MenuItem>
            {NOTIFICATION_GROUP_OPTIONS.map((option: any) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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

        {(filters.state.memberName || filters.state.type) && (
          <Box flexGrow={1} gap={1} display="flex" flexWrap="wrap" alignItems="center">
            <Button
              color="error"
              onClick={() => {
                filters.setState({ memberName: '', type: '', status: filters.state.status });
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
