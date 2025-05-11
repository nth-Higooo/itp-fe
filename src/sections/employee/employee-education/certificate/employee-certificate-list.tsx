import { Box, Skeleton, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom, TableNoData, useTable } from 'src/components/table';
import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';
import { EmployeeCertificateTableRow } from './employee-certificate-row';
import { EmployeeEducations } from 'src/data/employee/employee.model';
import { CertificateCreateEditForm } from './certificate-create-edit-from';

const HEAD = [
  { value: 'certificateName', label: 'Certificate Name', minWidth: 150 },
  { value: 'certificateWebsite', label: 'Certificate Website', minWidth: 200 },
  { value: 'YEAR', label: 'Year' },
  { value: '', label: '' },
];

interface ListProps {
  educationsList: EmployeeEducations[];
  isLoading: {
    value: boolean;
  };
  onDeleteRow: (id: string) => void;
  fetchDataList: () => void;
  employeeId: string;
}

//------------------------------------------------------

export function CertificateList({
  educationsList,
  employeeId,
  isLoading,
  onDeleteRow,
  fetchDataList = () => {},
}: ListProps) {
  const table = useTable({
    defaultOrderBy: 'name',
    defaultRowsPerPage: 10,
  });
  const editCerti = useBoolean();

  const selectedCertificate = useSetState(null);

  return (
    <Box>
      <CertificateCreateEditForm
        employeeId={employeeId}
        currentCertificate={selectedCertificate.state}
        open={editCerti.value}
        onClose={() => {
          editCerti.onFalse();
          selectedCertificate.onResetState();
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
                  <EmployeeCertificateTableRow
                    key={row.id}
                    row={row}
                    onDeleteRow={() => onDeleteRow(row.id)}
                    onEditRow={() => {
                      editCerti.onTrue();
                      selectedCertificate.setState(row);
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
    </Box>
  );
}
