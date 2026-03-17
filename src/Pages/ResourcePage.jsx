import React, { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    Chip,
    Button,
    TextField,
    InputAdornment,
    IconButton,
    Stack,
    Tabs,
    Tab,
    Checkbox,
    Tooltip,
    LinearProgress,
    TablePagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Menu
} from '@mui/material';
import {
    Plus,
    Search,
    Download,
    Filter,
    Calendar,
    Users,
    MoreVertical,
    Briefcase,
    Zap
} from 'lucide-react';
import { format } from 'date-fns';

const initialResources = [
    { id: 'RT-101', projectName: 'E-HRM Modernization', resourceName: 'Engineering Team A', startDate: '2024-03-01', endDate: '2024-09-30', skills: ['React', 'Node.js'], headcount: 5, status: 'Active', progress: 65 },
    { id: 'RT-102', projectName: 'Cloud Migration', resourceName: 'DevOps Unit', startDate: '2024-02-15', endDate: '2024-05-15', skills: ['AWS', 'Terraform'], headcount: 3, status: 'Active', progress: 40 },
    { id: 'RT-103', projectName: 'Mobile App Sync', resourceName: 'Mobile Squad', startDate: '2024-04-10', endDate: '2024-08-20', skills: ['React Native', 'Firebase'], headcount: 4, status: 'Pending', progress: 0 },
    { id: 'RT-104', projectName: 'Analytics Dashboard', resourceName: 'Data Analytics', startDate: '2024-01-05', endDate: '2024-03-30', skills: ['Python', 'Tableau'], headcount: 2, status: 'Completed', progress: 100 },
    { id: 'RT-105', projectName: 'QA Automation', resourceName: 'Quality Team', startDate: '2024-05-01', endDate: '2024-07-15', skills: ['Selenium', 'Java'], headcount: 3, status: 'Planning', progress: 15 },
    { id: 'RT-106', projectName: 'Internal Tools', resourceName: 'System Admin', startDate: '2024-02-01', endDate: '2024-12-31', skills: ['Linux', 'Shell'], headcount: 2, status: 'Active', progress: 50 },
];

const ResourcePage = () => {
    const [resources, setResources] = useState(initialResources);
    const [tabValue, setTabValue] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedIds, setSelectedIds] = useState([]);

    // Add Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newAllocation, setNewAllocation] = useState({
        projectName: '', resourceName: '', startDate: '', endDate: '', headcount: 1, status: 'Planning', skills: ''
    });

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setPage(0);
    };

    // Derived Data
    const filteredResources = useMemo(() => {
        let result = resources;

        // Apply Tab Filter
        if (tabValue === 1) result = result.filter(r => r.status === 'Active');
        if (tabValue === 2) result = result.filter(r => r.status === 'Pending' || r.status === 'Planning');
        if (tabValue === 3) result = result.filter(r => r.headcount > 3); // Over-allocated mock rule

        // Apply Search Filter
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            result = result.filter(r =>
                r.projectName.toLowerCase().includes(lowerSearch) ||
                r.resourceName.toLowerCase().includes(lowerSearch) ||
                r.id.toLowerCase().includes(lowerSearch)
            );
        }

        return result;
    }, [resources, tabValue, searchTerm]);

    const paginatedResources = useMemo(() => {
        return filteredResources.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [filteredResources, page, rowsPerPage]);

    // Selection Logic
    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedIds(filteredResources.map(r => r.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id) => {
        const selectedIndex = selectedIds.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedIds, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedIds.slice(1));
        } else if (selectedIndex === selectedIds.length - 1) {
            newSelected = newSelected.concat(selectedIds.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedIds.slice(0, selectedIndex),
                selectedIds.slice(selectedIndex + 1),
            );
        }
        setSelectedIds(newSelected);
    };

    const isSelected = (id) => selectedIds.indexOf(id) !== -1;

    // Export Logic
    const handleExportCode = () => {
        const headers = ['ID', 'Project Name', 'Resource Name', 'Start Date', 'End Date', 'Headcount', 'Status', 'Progress (%)'];
        const csvContent = [
            headers.join(','),
            ...resources.map(r => [
                r.id,
                `"${r.projectName}"`,
                `"${r.resourceName}"`,
                r.startDate,
                r.endDate,
                r.headcount,
                r.status,
                r.progress
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `resource_tracker_export_${format(new Date(), 'yyyyMMdd')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Add Logic
    const handleAddAllocation = () => {
        const newId = `RT-${Math.floor(Math.random() * 900) + 100}`;
        const newEntry = {
            ...newAllocation,
            id: newId,
            skills: newAllocation.skills.split(',').map(s => s.trim()).filter(Boolean),
            progress: 0
        };
        setResources(prev => [newEntry, ...prev]);
        setIsAddModalOpen(false);
        setNewAllocation({ projectName: '', resourceName: '', startDate: '', endDate: '', headcount: 1, status: 'Planning', skills: '' });
    };

    const getStatusChip = (status) => {
        const colors = {
            'Active': { color: '#10b981', bgcolor: '#d1fae5' },
            'Pending': { color: '#f59e0b', bgcolor: '#fef3c7' },
            'Completed': { color: '#6366f1', bgcolor: '#e0e7ff' },
            'Planning': { color: '#64748b', bgcolor: '#f1f5f9' },
        };
        const style = colors[status] || colors['Planning'];
        return (
            <Chip
                label={status}
                size="small"
                sx={{
                    bgcolor: style.bgcolor,
                    color: style.color,
                    fontWeight: 700,
                    borderRadius: '8px'
                }}
            />
        );
    };

    return (
        <Box sx={{ p: 4 }}>
            {/* Header Section */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 3, mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
                        Resource Tracker
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage and monitor resource allocation across all active projects.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2} sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' } }}>
                    <Button
                        variant="outlined"
                        startIcon={<Download size={18} />}
                        onClick={handleExportCode}
                        sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, borderColor: '#e2e8f0', color: '#64748b' }}
                    >
                        Export Data
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Plus size={20} />}
                        onClick={() => setIsAddModalOpen(true)}
                        sx={{ borderRadius: '12px', px: 3, py: 1.2, textTransform: 'none', fontWeight: 700, boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)' }}
                    >
                        Add Allocation
                    </Button>
                </Stack>
            </Box>

            {/* Tabs Section */}
            <Box sx={{ mb: 3, borderBottom: '1px solid #f1f5f9' }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            minWidth: 120,
                            fontSize: '0.9rem',
                            color: '#64748b',
                            '&.Mui-selected': { color: 'primary.main' }
                        }
                    }}
                >
                    <Tab label={`All Resources ${resources.length}`} />
                    <Tab label="Active" />
                    <Tab label="Bench" />
                    <Tab label="Over-allocated" />
                </Tabs>
            </Box>

            {/* Filters Row */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { md: 'center' }, gap: 2, mb: 3 }}>
                <TextField
                    size="small"
                    placeholder="Search by project or resource..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search size={18} color="#94a3b8" />
                            </InputAdornment>
                        ),
                        sx: { borderRadius: '12px', bgcolor: '#fff', width: { xs: '100%', md: '350px' }, border: '1px solid #e2e8f0' }
                    }}
                />
                <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
                    <Button
                        startIcon={<Calendar size={18} />}
                        fullWidth
                        sx={{ borderRadius: '10px', bgcolor: '#fff', border: '1px solid #e2e8f0', color: '#1e293b', textTransform: 'none', fontWeight: 600 }}
                    >
                        Mar 01, 2024 - Mar 31, 2024
                    </Button>
                    <IconButton sx={{ borderRadius: '10px', border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
                        <Filter size={18} color="#64748b" />
                    </IconButton>
                </Stack>
            </Box>

            {/* Table Card */}
            <Card sx={{ borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#fafafa' }}>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        size="small"
                                        indeterminate={selectedIds.length > 0 && selectedIds.length < filteredResources.length}
                                        checked={filteredResources.length > 0 && selectedIds.length === filteredResources.length}
                                        onChange={handleSelectAll}
                                    />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase', fontSize: '0.75rem', minWidth: '240px' }}>Resource / Project</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase', fontSize: '0.75rem', minWidth: '180px' }}>Duration</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase', fontSize: '0.75rem' }}>Skills</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase', fontSize: '0.75rem' }}>Headcount</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase', fontSize: '0.75rem' }}>Status</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase', fontSize: '0.75rem' }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedResources.length > 0 ? paginatedResources.map((row) => {
                                const isItemSelected = isSelected(row.id);
                                return (
                                    <TableRow
                                        key={row.id}
                                        hover
                                        selected={isItemSelected}
                                        sx={{ '&:last-child td': { border: 0 }, cursor: 'pointer' }}
                                        onClick={() => handleSelectOne(row.id)}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox size="small" checked={isItemSelected} />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar sx={{ bgcolor: '#eff6ff', color: 'primary.main', borderRadius: '12px' }}>
                                                    <Briefcase size={20} />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                                        {row.projectName}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        ID: {row.id} • {row.resourceName}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>
                                                    {row.startDate} - {row.endDate}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={row.progress}
                                                        sx={{ width: '100%', maxWidth: 80, height: 6, borderRadius: 3, bgcolor: '#f1f5f9' }}
                                                    />
                                                    <Typography variant="caption" color="text.secondary">{row.progress}%</Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: '6px' }}>
                                                {row.skills.map((skill, i) => (
                                                    <Chip
                                                        key={i}
                                                        label={skill}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: '#64748b',
                                                            color: '#fff',
                                                            fontSize: '0.7rem',
                                                            fontWeight: 600,
                                                            height: '24px',
                                                            borderRadius: '12px'
                                                        }}
                                                    />
                                                ))}
                                                {row.skills.length === 0 && <Typography variant="caption" color="text.secondary">N/A</Typography>}
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Users size={16} color="#94a3b8" />
                                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                    {row.headcount}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusChip(row.status)}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); /* would open menu here */ }}>
                                                <MoreVertical size={18} color="#64748b" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            }) : (
                                <TableRow>
                                    <TableCell colSpan={7} sx={{ py: 6, textAlign: 'center' }}>
                                        <Typography variant="body1" color="text.secondary">
                                            No resources found. Try adjusting your search or filters.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredResources.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                    sx={{
                        borderTop: '1px solid #e2e8f0',
                        '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                            fontWeight: 600,
                            color: '#64748b'
                        }
                    }}
                />
            </Card>

            {/* Add Allocation Modal */}
            <Dialog open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
                <DialogTitle sx={{ fontWeight: 800 }}>Create New Allocation</DialogTitle>
                <DialogContent dividers sx={{ border: 'none' }}>
                    <Grid container spacing={3} sx={{ mt: 0 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Project Name"
                                size="small"
                                value={newAllocation.projectName}
                                onChange={(e) => setNewAllocation({ ...newAllocation, projectName: e.target.value })}
                                InputProps={{ sx: { borderRadius: '10px' } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Resource/Team Name"
                                size="small"
                                value={newAllocation.resourceName}
                                onChange={(e) => setNewAllocation({ ...newAllocation, resourceName: e.target.value })}
                                InputProps={{ sx: { borderRadius: '10px' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Start Date"
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                value={newAllocation.startDate}
                                onChange={(e) => setNewAllocation({ ...newAllocation, startDate: e.target.value })}
                                InputProps={{ sx: { borderRadius: '10px' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="End Date"
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                value={newAllocation.endDate}
                                onChange={(e) => setNewAllocation({ ...newAllocation, endDate: e.target.value })}
                                InputProps={{ sx: { borderRadius: '10px' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Headcount"
                                size="small"
                                value={newAllocation.headcount}
                                onChange={(e) => setNewAllocation({ ...newAllocation, headcount: e.target.value })}
                                InputProps={{ sx: { borderRadius: '10px' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Status</InputLabel>
                                <Select
                                    label="Status"
                                    value={newAllocation.status}
                                    onChange={(e) => setNewAllocation({ ...newAllocation, status: e.target.value })}
                                    sx={{ borderRadius: '10px' }}
                                >
                                    <MenuItem value="Active">Active</MenuItem>
                                    <MenuItem value="Pending">Pending</MenuItem>
                                    <MenuItem value="Planning">Planning</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Skills (comma separated)"
                                size="small"
                                placeholder="e.g. React, Node.js, AWS"
                                value={newAllocation.skills}
                                onChange={(e) => setNewAllocation({ ...newAllocation, skills: e.target.value })}
                                InputProps={{ sx: { borderRadius: '10px' } }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button onClick={() => setIsAddModalOpen(false)} sx={{ fontWeight: 600, color: '#64748b', textTransform: 'none' }}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleAddAllocation}
                        disabled={!newAllocation.projectName || !newAllocation.resourceName}
                        sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, px: 3 }}
                    >
                        Save Allocation
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default ResourcePage;


