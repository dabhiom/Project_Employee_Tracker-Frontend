import React, { useState } from 'react';

import { Check, X, MessageSquare, User, Calendar, Clock } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { useLeave } from '../../Context/LeaveContext';
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Card,
    Avatar,
    Button,
    Stack,
    Divider,
    Paper
} from '@mui/material';

const Approvals = () => {
    const { user, checkPermission, leaves, timesheets, updateLeaveStatus, updateTimesheetStatus } = useLeave();
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    if (!user) return <Box sx={{ p: 4 }}><Typography>Loading...</Typography></Box>;

    if (!checkPermission('teamlead')) {
        return (
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <Typography color="text.secondary">You do not have permission to view this page.</Typography>
                </Box>
            </Box>
        );
    }

    const pendingLeaves = leaves.filter(l => l.status === 'pending');
    const pendingTimesheets = timesheets.filter(t => t.status === 'pending');

    const handleAction = (type, id, action) => {
        if (type === 'leave') {
            updateLeaveStatus(id, action === 'approve' ? 'approved' : 'rejected', 'Decision made by supervisor.');
        } else {
            updateTimesheetStatus(id, action === 'approve' ? 'approved' : 'rejected');
        }
        toast.success(`${type === 'leave' ? 'Leave' : 'Timesheet'} ${action}ed successfully!`);
    };

    return (
        <Box>
            <Toaster position="top-right" />
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        textColor="primary"
                        indicatorColor="primary"
                    >
                        <Tab
                            label={`Leave Requests (${pendingLeaves.length})`}
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                        />
                        <Tab
                            label={`Timesheet Submissions (${pendingTimesheets.length})`}
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                        />
                    </Tabs>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {activeTab === 0 ? (
                        <>
                            {pendingLeaves.map(leave => (
                                <Card key={leave.id} sx={{ p: 3, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Stack direction="row" spacing={4} sx={{ flex: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 200 }}>
                                            <Avatar sx={{ bgcolor: '#eff6ff', color: 'primary.main', borderRadius: '12px', width: 44, height: 44 }}>
                                                <User size={20} />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{leave.employeeName}</Typography>
                                                <Typography variant="caption" color="text.secondary">Applied on {leave.appliedDate}</Typography>
                                            </Box>
                                        </Box>

                                        <Stack spacing={0.5}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Calendar size={16} color="#64748b" />
                                                <Typography variant="body2">
                                                    {leave.type}: <strong>{leave.startDate} to {leave.endDate}</strong> ({leave.days} days)
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <MessageSquare size={16} color="#64748b" />
                                                <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                                                    "{leave.reason}"
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Stack>

                                    <Stack direction="row" spacing={2}>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<X size={18} />}
                                            onClick={() => handleAction('leave', leave.id, 'reject')}
                                            sx={{ borderRadius: '10px', textTransform: 'none' }}
                                        >
                                            Reject
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            startIcon={<Check size={18} />}
                                            onClick={() => handleAction('leave', leave.id, 'approve')}
                                            sx={{ borderRadius: '10px', textTransform: 'none', boxShadow: 'none' }}
                                        >
                                            Approve
                                        </Button>
                                    </Stack>
                                </Card>
                            ))}
                            {pendingLeaves.length === 0 && (
                                <Box sx={{ p: 4, textAlign: 'center' }}>
                                    <Typography color="text.secondary">No pending leave requests.</Typography>
                                </Box>
                            )}
                        </>
                    ) : (
                        <>
                            {pendingTimesheets.map(ts => (
                                <Card key={ts.id} sx={{ p: 3, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Stack direction="row" spacing={4} sx={{ flex: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 200 }}>
                                            <Avatar sx={{ bgcolor: '#eff6ff', color: 'primary.main', borderRadius: '12px', width: 44, height: 44 }}>
                                                <User size={20} />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{ts.employeeName}</Typography>
                                                <Typography variant="caption" color="text.secondary">Submitted for {ts.date}</Typography>
                                            </Box>
                                        </Box>

                                        <Stack spacing={0.5}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Clock size={16} color="#64748b" />
                                                <Typography variant="body2">
                                                    {ts.project}: <strong>{ts.hours} hours</strong>
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <MessageSquare size={16} color="#64748b" />
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    {ts.task}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Stack>

                                    <Stack direction="row" spacing={2}>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<X size={18} />}
                                            onClick={() => handleAction('ts', ts.id, 'reject')}
                                            sx={{ borderRadius: '10px', textTransform: 'none' }}
                                        >
                                            Reject
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            startIcon={<Check size={18} />}
                                            onClick={() => handleAction('ts', ts.id, 'approve')}
                                            sx={{ borderRadius: '10px', textTransform: 'none', boxShadow: 'none' }}
                                        >
                                            Approve
                                        </Button>
                                    </Stack>
                                </Card>
                            ))}
                            {pendingTimesheets.length === 0 && (
                                <Box sx={{ p: 4, textAlign: 'center' }}>
                                    <Typography color="text.secondary">No pending timesheet submissions.</Typography>
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default Approvals;



