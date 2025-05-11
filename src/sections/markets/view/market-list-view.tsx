import { Box, Button, Card, Skeleton, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { useEffect } from 'react';
import { ButtonCreate } from 'src/components/button-permission/button-permission';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom, TableNoData, TableSelectedAction, useTable } from 'src/components/table';
import { UserPermission } from 'src/data/auth/role.model';
import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';
import { DashboardContent } from 'src/layouts/dashboard';
import { useAppDispatch, useAppSelector } from 'src/redux/store';

import { ConfirmDialog } from 'src/components/custom-dialog';

import { toast } from 'sonner';
import { selectMarkets } from 'src/redux/market/markets.slice';
import { MarketCreateEditForm } from '../market-create-edit-form';
import { MarketTableRow } from '../market-table-row';
import { deleteMarketAsync, getMarketAsync } from 'src/services/market.service';

const TABLE_HEAD = [
  { id: 'name', label: 'Market', minWidth: 300 },
  { id: 'description', label: 'Description', minWidth: 300 },
  { id: '', label: '' },
];

// ----------------------------------------------------------------------
export function MarketListView() {
  const { markets } = useAppSelector(selectMarkets);

  const table = useTable({
    defaultOrderBy: 'name',
    defaultRowsPerPage: 10,
  });
  const createEdit = useBoolean();
  const confirmDelete = useBoolean();
  const isLoading = useBoolean();
  const dispatch = useAppDispatch();
  const selectedMarket = useSetState(null);

  const handleDeleteRow = async (id?: string) => {
    if (id) {
      const response = await dispatch(deleteMarketAsync(id));
      if (response.meta.requestStatus === 'fulfilled') {
        toast.success('Add degree successfully!');
        selectedMarket.onResetState();
        fetchDataList();
      }
      confirmDelete.onFalse();
    }
  };
  const fetchDataList = async () => {
    isLoading.onTrue();
    await dispatch(
      getMarketAsync({
        pageIndex: table.page + 1,
        pageSize: table.rowsPerPage,
        orderBy: table.order,
        sortBy: table.orderBy,
      })
    );
    isLoading.onFalse();
  };

  useEffect(() => {
    fetchDataList();
  }, [table.page, table.rowsPerPage, table.orderBy, table.order]);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Markets"
          action={
            <ButtonCreate
              permission={UserPermission.MARKET_MANAGEMENT}
              label="New Market"
              props={{
                variant: 'contained',
                color: 'primary',
                startIcon: <Iconify icon="mdi:plus" />,
                onClick: () => {
                  if (selectedMarket) {
                    selectedMarket.onResetState();
                  }

                  createEdit.onTrue();
                },
              }}
            />
          }
        />
        <MarketCreateEditForm
          currentMarket={selectedMarket.state}
          open={createEdit.value}
          onClose={() => {
            createEdit.onFalse();
            selectedMarket.onResetState();
          }}
          fetchDataList={fetchDataList}
        />

        <Card>
          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction dense={table.dense} numSelected={table.selected.length} />

            <Scrollbar>
              <Table
                size={table.dense ? 'small' : 'medium'}
                sx={{ minWidth: 720, alignItems: 'center' }}
              >
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  onSort={table.onSort}
                />

                <TableBody>
                  {!isLoading.value &&
                    markets.map((row: any, index: number) => (
                      <MarketTableRow
                        key={index}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onEditRow={() => {
                          createEdit.onTrue();
                          selectedMarket.setState(row);
                        }}
                        onDeleteRow={() => {
                          confirmDelete.onTrue();
                          selectedMarket.setState(row);
                        }}
                      />
                    ))}

                  {!isLoading.value && markets.length === 0 && (
                    <>
                      <TableNoData notFound={!markets.length} />
                    </>
                  )}

                  {isLoading.value &&
                    Array(7)
                      .fill(7)
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
        </Card>
      </DashboardContent>
      <ConfirmDialog
        open={confirmDelete.value}
        onClose={() => {
          confirmDelete.onFalse();
          selectedMarket.onResetState();
        }}
        title="Delete"
        content={<>Are you sure want to delete this Market?</>}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteRow(selectedMarket.state.id)}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
