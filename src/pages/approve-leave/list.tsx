import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { selectLeaveId } from 'src/redux/leave/leave.slice';
import { useAppDispatch } from 'src/redux/store';
import { useParams } from 'src/routes/hooks';
import { LeaveApproverView } from 'src/sections/leave-request-approver/view';

// ----------------------------------------------------------------------

const metadata = { title: `Approve Leave Requests| ${CONFIG.appName}` };

export default function Page() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(selectLeaveId(id));
  },[id]);
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <LeaveApproverView />
    </>
  );
}
