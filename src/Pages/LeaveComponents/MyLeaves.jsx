import React, { useState } from 'react';

import { Search, Filter, Eye, XCircle, Download, MoreHorizontal } from 'lucide-react';
import { mockLeaves } from '../../data/mockData';
import { useLeave } from '../../Context/LeaveContext';

import {
    Box,
    Card,
    Typography,
    TextField,
    MenuItem,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Tooltip,
    InputAdornment,
    Pagination,
    Stack
} from '@mui/material';
const MyLeaves = () => {
    const { user, checkPermission, leaves } = useLeave();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    if (!user) return <Box sx={{ p: 4 }}><Typography>Loading...</Typography></Box>;

    const filteredLeaves = leaves.filter(leave => {
        const isOwner = checkPermission('admin') ? true : leave.employeeName === user.name;
        const matchesSearch = leave.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            leave.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || leave.status.toLowerCase() === statusFilter.toLowerCase();
        return isOwner && matchesSearch && matchesStatus;
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
                        placeholder="Search by ID or Leave Type..."
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

                    <Stack direction="row" spacing={2} alignItems="center">
                        <TextField
                            select
                            size="small"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Filter size={18} color="#94a3b8" />
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: '12px', bgcolor: '#f8fafc', minWidth: '130px' }
                            }}
                        >
                            <MenuItem value="All">All Status</MenuItem>
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Approved">Approved</MenuItem>
                            <MenuItem value="Rejected">Rejected</MenuItem>
                        </TextField>

                        <Button
                            variant="outlined"
                            startIcon={<Download size={18} />}
                            sx={{ borderRadius: '12px', textTransform: 'none', color: '#64748b', borderColor: '#e2e8f0' }}
                        >
                            Export
                        </Button>
                    </Stack>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#fafafa' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Leave ID</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Leave Type</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Applied Date</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Dates</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Days</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredLeaves.map((leave) => (
                                <TableRow key={leave.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>{leave.id}</TableCell>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>{leave.type}</Typography>
                                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>{leave.reason}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ color: '#64748b' }}>{leave.appliedDate}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1e293b', whiteSpace: 'nowrap' }}>
                                            <Typography variant="body2">{leave.startDate}</Typography>
                                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>to</Typography>
                                            <Typography variant="body2">{leave.endDate}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>{leave.days} Days</TableCell>
                                    <TableCell>{getStatusChip(leave.status)}</TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <Tooltip title="View Details">
                                                <IconButton size="small" sx={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                                                    <Eye size={16} color="#64748b" />
                                                </IconButton>
                                            </Tooltip>
                                            {leave.status === 'pending' && (
                                                <Tooltip title="Cancel Leave">
                                                    <IconButton size="small" sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', '&:hover': { bgcolor: '#fff1f2' } }}>
                                                        <XCircle size={16} color="#ef4444" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            <IconButton size="small" sx={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                                                <MoreHorizontal size={16} color="#64748b" />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {filteredLeaves.length === 0 && (
                    <Box sx={{ p: 8, textAlign: 'center' }}>
                        <Typography color="text.secondary">No leave requests found matching your criteria.</Typography>
                    </Box>
                )}

                <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#fff' }}>
                    <Typography variant="caption" color="text.secondary">
                        Showing 1 to {filteredLeaves.length} of {filteredLeaves.length} entries
                    </Typography>
                    <Pagination count={1} shape="rounded" size="small" />
                </Box>
            </Paper>
        </Box>
    );
};

export default MyLeaves;



