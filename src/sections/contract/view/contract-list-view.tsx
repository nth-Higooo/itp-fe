import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { useBoolean } from 'src/hooks/use-boolean';
import { _roles, _userList } from 'src/_mock';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { useTable, TableNoData, TableHeadCustom, TableSelectedAction } from 'src/components/table';

import { ContractTableRow } from '../contract-table-row';
import { ContractCreateEditForm } from '../contract-create-edit-form';
import { selectContract } from 'src/redux/contract';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { getContractsByIdAsync } from 'src/services/contract';
import { Skeleton, Stack, TableCell, TableRow } from '@mui/material';
import { PaginationItems } from 'src/components/pagination';
import { ButtonCreate } from 'src/components/button-permission/button-permission';
import { UserPermission } from 'src/data/auth/role.model';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'contractNumber', label: 'Contract Number', width: 150 },
  { id: 'name', label: 'Name' },
  { id: 'startDate', label: 'Start Date', width: 180, sortable: true },
  { id: 'endDate', label: 'End Date', width: 100, sortable: true },
  { id: 'workingType', label: 'Working Type', width: 100 },
  { id: 'contractType', label: 'Contract Type', width: 100 },
  { id: 'Remote', label: 'Remote', width: 100 },
  { id: 'status', label: 'Status', width: 100, sortable: true },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function ContractListView({ currentEmployee }: any) {
  const { contractsList, count } = useAppSelector(selectContract);

  const table = useTable({
    defaultOrderBy: 'status',
    defaultRowsPerPage: 10,
  });

  const isLoading = useBoolean();

  const dispatch = useAppDispatch();

  const create = useBoolean();

  const fetchDataList = async () => {
    isLoading.onTrue();
    await dispatch(
      getContractsByIdAsync({
        id: currentEmployee.id,
        params: {
          pageSize: table.rowsPerPage,
          pageIndex: table.page + 1,
          orderBy: table.order,
          sortBy: table.orderBy,
        },
      })
    );
    isLoading.onFalse();
  };
  useEffect(() => {
    fetchDataList();
  }, [table.page, table.rowsPerPage, table.order, table.orderBy, contractsList.length]);

  return (
    <>
      <ContractCreateEditForm
        refreshFunction={fetchDataList}
        open={create.value}
        onClose={create.onFalse}
        currentEmployee={currentEmployee}
      />
      <Card>
        <Stack sx={{ width: '100%', display: 'flex', alignItems: 'flex-end', p: 2 }}>
          <ButtonCreate
            permission={UserPermission.CONTRACT_MANAGEMENT}
            label="New contract"
            props={{
              onClick: create.onTrue,
              variant: 'contained',
              color: 'primary',
              startIcon: <Iconify icon="mingcute:add-line" />,
            }}
          />
        </Stack>
        <Box sx={{ position: 'relative' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={Math.min(count - table.rowsPerPage * table.page, table.rowsPerPage)}
            onSelectAllRows={(checked: boolean) =>
              table.onSelectAllRows(
                checked,
                contractsList.map((row: any) => row.id)
              )
            }
          />
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 720 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                disabledCheckbox={true}
                headLabel={TABLE_HEAD}
                rowCount={Math.min(count - table.rowsPerPage * table.page, table.rowsPerPage)}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked: boolean) =>
                  table.onSelectAllRows(
                    checked,
                    contractsList.map((row: any) => row.id)
                  )
                }
              />

              <TableBody>
                {!isLoading.value &&
                  contractsList.map((row: any) => (
                    <ContractTableRow
                      key={row.id}
                      row={row}
                      resetFunction={fetchDataList}
                      rowEmployee={currentEmployee.state}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />
                  ))}

                {!isLoading.value && contractsList.length === 0 && (
                  <>
                    <TableNoData notFound={!contractsList.length} />
                  </>
                )}
                {isLoading.value &&
                  Array(5)
                    .fill(5)
                    .map((row: any) => {
                      return (
                        <TableRow>
                          <TableCell colSpan={9} align="center">
                            <Skeleton variant="rounded" width={'100%'} height={60} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
              </TableBody>
            </Table>
          </Scrollbar>
        </Box>

        <PaginationItems
          page={table.page}
          dense={table.dense}
          count={count}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onChangeDense={table.onChangeDense}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </>
  );
}
