import { ContractListView } from '../contract/view';

// ----------------------------------------------------------------------

export function EmployeeTabContract({ currentEmployee, canEdit }: any) {
  return (
    <>
      <ContractListView currentEmployee={currentEmployee} canEdit={canEdit} />
    </>
  );
}
