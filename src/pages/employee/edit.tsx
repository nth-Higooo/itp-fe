import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { _userList } from 'src/_mock/_user';

import { EmployeeFormView } from 'src/sections/employee/view';
import { useEffect } from 'react';
import { getEmployeeInfoAsync } from 'src/services/employee/employee.service';
import { useAppDispatch, useAppSelector } from 'src/redux/store';
import { selectEmployees } from 'src/redux/employee/employees.slice';

// ----------------------------------------------------------------------

const metadata = { title: `Employee edit | ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();
  const dispatch = useAppDispatch();
  const { detailEmployee } = useAppSelector(selectEmployees);

  useEffect(() => {
    if (id) {
      dispatch(getEmployeeInfoAsync(id));
    }
  }, [dispatch, id]);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <EmployeeFormView currentEmployee={detailEmployee} role="Employer" />
    </>
  );
}
