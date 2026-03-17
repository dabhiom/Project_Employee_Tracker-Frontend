import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import LeaveDashboard from './LeaveComponents/LeaveDashboard';
import ApplyLeave from './LeaveComponents/ApplyLeave';
import MyLeaves from './LeaveComponents/MyLeaves';
import Calendar from './LeaveComponents/Calendar';
import TimesheetEntry from './LeaveComponents/TimesheetEntry';
import TimesheetHistory from './LeaveComponents/TimesheetHistory';
import Settings from './LeaveComponents/Settings';
import Approvals from './LeaveComponents/Approvals';

import { 
  LayoutDashboard,
  Users, 
  ClipboardList, 
  Calendar as CalendarIcon, 
  FileText, 
  History, 
  Settings as SettingsIcon,
  CheckCircle 
} from 'lucide-react';

function LeavePage() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const tabs = [
    { label: 'Dashboard', component: <LeaveDashboard onApplyLeave={() => setTabValue(1)} />, icon: <LayoutDashboard size={18} /> },
    { label: 'Apply Leave', component: <ApplyLeave onSuccess={() => setTabValue(2)} />, icon: <Users size={18} /> },
    { label: 'My Leaves', component: <MyLeaves />, icon: <ClipboardList size={18} /> },
    { label: 'Calendar', component: <Calendar onApplyLeave={() => setTabValue(1)} />, icon: <CalendarIcon size={18} /> },
    { label: 'Timesheet Entry', component: <TimesheetEntry onSuccess={() => setTabValue(5)} />, icon: <FileText size={18} /> },
    { label: 'Timesheet History', component: <TimesheetHistory />, icon: <History size={18} /> },
    { label: 'Approvals', component: <Approvals />, icon: <CheckCircle size={18} /> },
    { label: 'Settings', component: <Settings />, icon: <SettingsIcon size={18} /> },
  ];

  return (
    <Box sx={{ p: 0, height: '100%', overflowX: 'hidden' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#6c63ff',
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              minWidth: 100,
              fontSize: '0.9rem',
              color: '#64748b',
              py: 2,
              display: 'flex',
              flexDirection: 'row',
              gap: 1,
              '&.Mui-selected': { 
                color: '#6c63ff',
              }
            }
          }}
        >
          {tabs.map((tab, index) => (
            <Tab 
                key={index} 
                label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {tab.icon}
                        <Typography variant="body2" sx={{ fontWeight: 'inherit', fontSize: 'inherit' }}>{tab.label}</Typography>
                    </Box>
                } 
            />
          ))}
        </Tabs>
      </Box>

      {/* Render the selected component */}
      <Box sx={{ px: 0 }}>
          {tabs[tabValue].component}
      </Box>
    </Box>
  );
}

export default LeavePage;
