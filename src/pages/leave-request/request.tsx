import React from 'react'
import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import LeavePageOfEmployee from 'src/sections/leave-request/view/leave-page-view';


const metadata = { title: `Leave Request | ${CONFIG.appName}` };

function LeaveRequestPage() {
  return (
    <>
        <Helmet>
            <title> {metadata.title}</title>
        </Helmet>
        
        <LeavePageOfEmployee />
    </>
  )
}

export default LeaveRequestPage
