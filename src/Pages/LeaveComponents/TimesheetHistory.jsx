import React, { useState } from 'react';

import { Search, Download, FileText, CheckCircle, Clock } from 'lucide-react';
import { mockTimesheets } from '../../data/mockData';
import { useLeave } from '../../Context/LeaveContext';

import {
    Box,
    Card,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Button,
    IconButton,
    Chip,
    Stack,
    Tooltip,
    InputAdornment
} from '@mui/material';
const TimesheetHistory = () => {
    const { user, timesheets, checkPermission } = useLeave();
    const [searchTerm, setSearchTerm] = useState('');

    if (!user) return <Box sx={{ p: 4 }}><Typography>Loading...</Typography></Box>;

    const filteredTimesheets = timesheets.filter(ts => {
        const isOwner = checkPermission('admin') ? true : ts.employeeName === user.name;
        const matchesSearch = ts.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ts.task.toLowerCase().includes(searchTerm.toLowerCase());
        return isOwner && matchesSearch;
    });

    const getStatusChip = (status) => {
        const statusLower = status.toLowerCase();
        let color = 'default';
        if (statusLower === 'approved') color = 'success';
        if (statusLower === 'pending') color = 'warning';
        if (statusLower === 'rejected') color = 'error';

        return (
            <Chip
                label={status}
                color={color}
                size="small"
                sx={{
                    fontWeight: 600,
                    borderRadius: '8px',
                    textTransform: 'capitalize',
                    px: 1
                }}
            />
        );
    };

    return (
        <Box>
            <Paper sx={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, borderBottom: '1px solid #f1f5f9' }}>
                    <TextField
                        size="small"
                        placeholder="Search by project or task..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search size={18} color="#94a3b8" />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: '12px', bgcolor: '#f8fafc', width: { xs: '100%', md: '400px' } }
                        }}
                    />

                    <Button
                        variant="outlined"
                        startIcon={<Download size={18} />}
                        sx={{ borderRadius: '12px', textTransform: 'none', color: '#64748b', borderColor: '#e2e8f0' }}
                    >
                        Export Report
                    </Button>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#fafafa' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Project</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Task Details</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Hours</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredTimesheets.map((ts) => (
                                <TableRow key={ts.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell sx={{ color: '#64748b' }}>{ts.date}</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>{ts.project}</TableCell>
                                    <TableCell>
                                        <Tooltip title={ts.task}>
                                            <Typography variant="body2" sx={{
                                                color: '#64748b',
                                                maxWidth: '300px',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {ts.task}
                                            </Typography>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>{ts.hours} hrs</TableCell>
                                    <TableCell>{getStatusChip(ts.status)}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="View Log">
                                            <IconButton size="small" sx={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                                                <FileText size={16} color="#64748b" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {filteredTimesheets.length === 0 && (
                    <Box sx={{ p: 8, textAlign: 'center' }}>
                        <Typography color="text.secondary">No records found matching your criteria.</Typography>
                    </Box>
                )}

                <Box sx={{ p: 3, display: 'flex', gap: 6, bgcolor: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ width: 40, height: 40, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#d1fae5', color: '#065f46' }}>
                            <CheckCircle size={20} />
                        </Box>
                        <Box>
                            <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Total Approved</Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>160 hrs</Typography>
                        </Box>
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ width: 40, height: 40, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fef3c7', color: '#92400e' }}>
                            <Clock size={20} />
                        </Box>
                        <Box>
                            <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Total Pending</Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>8 hrs</Typography>
                        </Box>
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
};

export default TimesheetHistory;



