import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

export function EmployeeTableFiltersResult({ filters, onResetPage, totalResults, sx }: any) {
  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    filters.setState({ displayName: '' });
  }, [filters, onResetPage]);

  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    filters.setState({ status: 'all' });
  }, [filters, onResetPage]);

  const handleRemoveRole = useCallback(
    (inputValue: any) => {
      const newValue = filters.state.role.filter((item: any) => item !== inputValue);

      onResetPage();
      filters.setState({ role: newValue });
    },
    [filters, onResetPage]
  );

  const handleReset = useCallback(() => {
    onResetPage();
    filters.onResetState();
  }, [filters, onResetPage]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Status:" isShow={filters.state.status !== 'all'}>
        <Chip
          size="small"
          variant="filled"
          label={filters.state.status}
          onDelete={handleRemoveStatus}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      <FiltersBlock label="Role:" isShow={!!filters.state.role.length}>
        {filters.state.role.map((item: any) => (
          <Chip
            size="small"
            variant="filled"
            key={item}
            label={item}
            onDelete={() => handleRemoveRole(item)}
          />
        ))}
      </FiltersBlock>

      <FiltersBlock label="Keyword:" isShow={!!filters.state.name}>
        <Chip
          size="small"
          variant="filled"
          label={filters.state.name}
          onDelete={handleRemoveKeyword}
        />
      </FiltersBlock>
    </FiltersResult>
  );
}
