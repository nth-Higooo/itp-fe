import { Box, Skeleton, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom, TableNoData, useTable } from 'src/components/table';
import { EmployeeEducations } from 'src/data/employee/employee.model';
import { AllEducationsTableRow } from './education-all-row';

const HEAD = [
  { value: 'name', label: 'Name', width: 120 },
  { value: 'institution', label: 'Institution', width: 80 },
  { value: 'YEAR', label: 'Year', width: 10 },
];

interface AllListProps {
  educationsList: EmployeeEducations[];
  isLoading: {
    value: boolean;
  };
}

//------------------------------------------------------

export function AllList({ educationsList, isLoading }: AllListProps) {
  const table = useTable({
    defaultOrderBy: 'name',
    defaultRowsPerPage: 10,
  });
  return (
    <>
      <Box sx={{ position: 'relative', height: 'max-content' }}>
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 300 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={HEAD}
              onSort={table.onSort}
            />

            <TableBody>
              {!isLoading.value &&
                educationsList?.map((row: any) => <AllEducationsTableRow key={row.id} row={row} />)}
              {!isLoading.value && educationsList.length === 0 && (
                <>
                  <TableNoData notFound={!educationsList.length} />
                </>
              )}

              {isLoading.value &&
                Array(3)
                  .fill(3)
                  .map((_, index: number) => {
                    return (
                      <TableRow key={index}>
                        <TableCell colSpan={3} align="center">
                          <Skeleton variant="rounded" width={'100%'} height={60} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
        </Scrollbar>
      </Box>
    </>
  );
}
