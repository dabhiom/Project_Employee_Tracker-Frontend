import React, { useState } from 'react';

import { Clock, Plus, Trash2, Send, Save, Info } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { useLeave } from '../../Context/LeaveContext';

import {
    Box,
    Grid,
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
    MenuItem,
    Button,
    IconButton,
    Stack,
    Tooltip,
    Alert,
    AlertTitle
} from '@mui/material';
const TimesheetEntry = ({ onSuccess }) => {
    const { addTimesheet, user } = useLeave();
    const [entries, setEntries] = useState([
        { id: 1, date: new Date().toISOString().split('T')[0], project: '', task: '', hours: 0 },
    ]);

    if (!user) return <Box sx={{ p: 4 }}><Typography>Loading...</Typography></Box>;

    const addRow = () => {
        setEntries([
            ...entries,
            { id: Date.now(), date: new Date().toISOString().split('T')[0], project: '', task: '', hours: 0 }
        ]);
    };

    const removeRow = (id) => {
        if (entries.length > 1) {
            setEntries(entries.filter(e => e.id !== id));
        }
    };

    const updateEntry = (id, field, value) => {
        setEntries(entries.map(e => e.id === id ? { ...e, [field]: value } : e));
    };

    const totalHours = entries.reduce((acc, curr) => acc + parseFloat(curr.hours || 0), 0);

    const handleSubmit = () => {
        if (totalHours === 0) {
            toast.error('Please add some hours before submitting');
            return;
        }

        let validEntries = 0;
        entries.forEach(entry => {
            if (entry.project && entry.task && parseFloat(entry.hours) > 0) {
                addTimesheet(entry);
                validEntries++;
            }
        });

        if (validEntries > 0) {
            toast.success('Timesheet submitted for approval!');
            setEntries([{ id: Date.now(), date: new Date().toISOString().split('T')[0], project: '', task: '', hours: 0 }]);
            if (onSuccess) onSuccess();
        } else {
            toast.error('Please fill in project and task details.');
        }
    };

    return (
        <Box>
            <Toaster position="top-right" />
            <Grid container spacing={4}>
                <Grid item xs={12} lg={8}>
                    <Card sx={{ p: 4, borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>Daily Task Logging</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Log your work hours for today: <strong>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1, bgcolor: '#eff6ff', color: 'primary.main', borderRadius: '12px', border: '1px solid #dbeafe' }}>
                                <Clock size={18} />
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>Total: {totalHours} hrs</Typography>
                            </Box>
                        </Box>

                        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e2e8f0', borderRadius: '16px', mb: 3 }}>
                            <Table>
                                <TableHead sx={{ bgcolor: '#fafafa' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Project</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Task Description</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', width: 120 }}>Hours</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', width: 80 }} align="center">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {entries.map((entry) => (
                                        <TableRow key={entry.id}>
                                            <TableCell>
                                                <TextField
                                                    select
                                                    fullWidth
                                                    size="small"
                                                    value={entry.project}
                                                    onChange={(e) => updateEntry(entry.id, 'project', e.target.value)}
                                                    InputProps={{ sx: { borderRadius: '8px' } }}
                                                >
                                                    <MenuItem value="">Select Project</MenuItem>
                                                    <MenuItem value="E-HRM Project">E-HRM Project</MenuItem>
                                                    <MenuItem value="Internal Dashboard">Internal Dashboard</MenuItem>
                                                    <MenuItem value="App Mobile Dev">App Mobile Dev</MenuItem>
                                                    <MenuItem value="QA Testing">QA Testing</MenuItem>
                                                </TextField>
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    placeholder="What did you work on?"
                                                    value={entry.task}
                                                    onChange={(e) => updateEntry(entry.id, 'task', e.target.value)}
                                                    InputProps={{ sx: { borderRadius: '8px' } }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    type="number"
                                                    inputProps={{ min: 0, max: 24, step: 0.5 }}
                                                    value={entry.hours}
                                                    onChange={(e) => updateEntry(entry.id, 'hours', e.target.value)}
                                                    InputProps={{ sx: { borderRadius: '8px' } }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="Delete Row">
                                                    <IconButton
                                                        onClick={() => removeRow(entry.id)}
                                                        sx={{ color: 'error.main', '&:hover': { bgcolor: '#fff1f2' } }}
                                                    >
                                                        <Trash2 size={18} />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Button
                                startIcon={<Plus size={18} />}
                                onClick={addRow}
                                sx={{ fontWeight: 700, textTransform: 'none', color: 'primary.main' }}
                            >
                                Add Another Task
                            </Button>
                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="outlined"
                                    startIcon={<Save size={18} />}
                                    sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, color: '#64748b', borderColor: '#e2e8f0' }}
                                >
                                    Save as Draft
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<Send size={18} />}
                                    onClick={handleSubmit}
                                    sx={{ borderRadius: '12px', px: 3, fontWeight: 700, textTransform: 'none', boxShadow: 'none' }}
                                >
                                    Submit Timesheet
                                </Button>
                            </Stack>
                        </Box>
                    </Card>
                </Grid>

                <Grid item xs={12} lg={4}>
                    <Alert
                        icon={<Info size={20} />}
                        sx={{
                            borderRadius: '24px',
                            bgcolor: '#eff6ff',
                            color: '#1e40af',
                            '& .MuiAlert-icon': { color: '#1e40af' },
                            p: 3,
                            border: '1px solid #dbeafe'
                        }}
                    >
                        <AlertTitle sx={{ fontWeight: 700, mb: 2 }}>Guidelines</AlertTitle>
                        <Stack spacing={2} component="ul" sx={{ pl: 2, m: 0 }}>
                            <Typography component="li" variant="body2">Log hours daily to avoid month-end rushes.</Typography>
                            <Typography component="li" variant="body2">Minimum 8 hours per day is expected.</Typography>
                            <Typography component="li" variant="body2">Mention project codes clearly in descriptions.</Typography>
                            <Typography component="li" variant="body2">Submission deadline is every Friday by 6 PM.</Typography>
                        </Stack>
                    </Alert>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TimesheetEntry;



