import { Box, Skeleton, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom, TableNoData, useTable } from 'src/components/table';
import { EmployeeEducationTableRow } from './employee-education-row';
import { EmployeeEducations } from 'src/data/employee/employee.model';
import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';
import { EducationCreateEditForm } from './education-create-edit-form';


const HEAD = [
  { value: 'DEGREE', label: 'Degree', minWidth: 150 },
  { value: 'SCHOOL', label: 'School', minWidth: 200 },
  { value: 'MAJOR', label: 'Major' },
  { value: 'YEAR', label: 'Year' },
  { value: '', label: '' },
];
interface ListProps {
  educationsList: EmployeeEducations[];
  isLoading: {
    value: boolean;
  };
  onDeleteRow: (id: string) => void;
  fetchDataList?: () => void;
  employeeId: string;
}

//------------------------------------------------------

export function EducationsList({
  educationsList,
  employeeId,
  isLoading,
  onDeleteRow,
  fetchDataList = () => {},
}: ListProps) {
  const editEdu = useBoolean();
  const table = useTable({
    defaultOrderBy: 'name',
    defaultRowsPerPage: 10,
  });
  const selectedEducation = useSetState(null);

  return (
    <>
      <EducationCreateEditForm
        employeeId={employeeId}
        currentEducation={selectedEducation.state}
        open={editEdu.value}
        onClose={() => {
          editEdu.onFalse();
          selectedEducation.onResetState();
        }}
        fetchDataList={fetchDataList}
      />
      <Box sx={{ position: 'relative', height: 'max-content' }}>
        <Scrollbar>
          <Table
            size={table.dense ? 'small' : 'medium'}
            sx={{ minWidth: 300, height: 'max-content' }}
          >
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={HEAD}
              onSort={table.onSort}
            />

            <TableBody>
              {!isLoading.value &&
                educationsList?.map((row: any) => (
                  <EmployeeEducationTableRow
                    key={row.id}
                    row={row}
                    onDeleteRow={() => onDeleteRow(row.id)}
                    onEditRow={() => {
                      editEdu.onTrue();
                      selectedEducation.setState(row);
                    }}
                  />
                ))}
              {!isLoading.value && educationsList.length === 0 && (
                <>
                  <TableNoData notFound={!educationsList.length} />
                </>
              )}

              {isLoading.value &&
                Array(7)
                  .fill(7)
                  .map((_, index: number) => {
                    return (
                      <TableRow key={index}>
                        <TableCell colSpan={7} align="center">
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
