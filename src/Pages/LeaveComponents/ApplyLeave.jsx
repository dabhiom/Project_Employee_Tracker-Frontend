import React, { useState, useEffect } from 'react';

import { Calendar, FileText, Paperclip, AlertCircle, Info } from 'lucide-react';
import { differenceInBusinessDays, format, isWeekend, addDays } from 'date-fns';
import { useLeave } from '../../Context/LeaveContext';
import toast, { Toaster } from 'react-hot-toast';

import {
    Box,
    Grid,
    Card,
    Typography,
    TextField,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Button,
    LinearProgress,
    Stack,
    Alert,
    AlertTitle,
} from '@mui/material';
const ApplyLeave = ({ onSuccess }) => {
    const { balances, addLeave, holidays, user } = useLeave();
    const [formData, setFormData] = useState({
        leaveType: 'Annual Leave',
        startDate: '',
        endDate: '',
        halfDay: false,
        reason: '',
        attachment: null
    });

    const [calculatedDays, setCalculatedDays] = useState(0);

    if (!user) return <Box sx={{ p: 4 }}><Typography>Loading...</Typography></Box>;

    const isHoliday = (date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return holidays.some(h => h.date === dateStr);
    };

    useEffect(() => {
        if (formData.startDate && (formData.endDate || formData.halfDay)) {
            const start = new Date(formData.startDate);
            const end = formData.halfDay ? start : new Date(formData.endDate);

            if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
                // Safety: Don't calculate more than 1 year (366 days)
                const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                if (diff > 366) {
                    setCalculatedDays(0);
                    return;
                }

                let days = 0;
                let current = start;
                while (current <= end) {
                    if (!isWeekend(current) && !isHoliday(current)) {
                        days++;
                    }
                    current = addDays(current, 1);
                }

                if (formData.halfDay && days > 0) {
                    days = 0.5;
                }

                setCalculatedDays(days);
            } else {
                setCalculatedDays(0);
            }
        }
    }, [formData.startDate, formData.endDate, formData.halfDay, holidays]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (calculatedDays <= 0) {
            toast.error('Please select valid working dates.');
            return;
        }

        const typeKey = formData.leaveType.split(' ')[0].toLowerCase();
        const currentBalance = balances[typeKey];

        if (currentBalance && (currentBalance.total - currentBalance.used - currentBalance.pending) < calculatedDays) {
            toast.error(`Insufficient ${formData.leaveType} balance!`);
            return;
        }

        const success = addLeave({
            type: formData.leaveType,
            startDate: formData.startDate,
            endDate: formData.halfDay ? formData.startDate : formData.endDate,
            days: calculatedDays,
            reason: formData.reason,
            halfDay: formData.halfDay,
            employeeName: user.name
        });

        if (success) {
            toast.success('Application submitted successfully!');
            setFormData({
                leaveType: 'Annual Leave',
                startDate: '',
                endDate: '',
                halfDay: false,
                reason: '',
                attachment: null
            });
            setCalculatedDays(0);
            if (onSuccess) onSuccess();
        } else {
            toast.error('Failed to submit application.');
        }
    };

    return (
        <Box>
            <Toaster position="top-right" />
            <Grid container spacing={4}>
                <Grid item xs={12} lg={8}>
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
                            Apply for Leave
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                            Fill in the details to submit your request for approval.
                        </Typography>
                    </Box>

                    <Card sx={{ p: { xs: 3, md: 5 }, borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Leave Type"
                                        value={formData.leaveType}
                                        onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                                        InputProps={{ sx: { borderRadius: '12px', bgcolor: '#f8fafc' } }}
                                    >
                                        <MenuItem value="Annual Leave">Annual Leave</MenuItem>
                                        <MenuItem value="Sick Leave">Sick Leave</MenuItem>
                                        <MenuItem value="Casual Leave">Casual Leave</MenuItem>
                                        <MenuItem value="Maternity Leave">Maternity Leave</MenuItem>
                                        <MenuItem value="Paternity Leave">Paternity Leave</MenuItem>
                                    </TextField>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={formData.halfDay}
                                                    onChange={(e) => setFormData({ ...formData, halfDay: e.target.checked })}
                                                    sx={{ '&.Mui-checked': { color: '#6c63ff' } }}
                                                />
                                            }
                                            label={<Typography variant="body2" sx={{ fontWeight: 500, color: '#64748b' }}>Apply for half day</Typography>}
                                        />
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="Start Date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            sx: { borderRadius: '12px', bgcolor: '#f8fafc' },
                                            startAdornment: <Calendar size={18} style={{ marginRight: '12px', color: '#94a3b8' }} />
                                        }}
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        type="date"
                                        label="End Date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        disabled={formData.halfDay}
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            sx: { borderRadius: '12px', bgcolor: '#f8fafc' },
                                            startAdornment: <Calendar size={18} style={{ marginRight: '12px', color: '#94a3b8' }} />
                                        }}
                                        required={!formData.halfDay}
                                    />
                                </Grid>
                            </Grid>

                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Reason"
                                placeholder="Reason for leave..."
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                InputProps={{
                                    sx: { borderRadius: '12px', bgcolor: '#f8fafc' },
                                    startAdornment: <FileText size={18} style={{ alignSelf: 'flex-start', marginTop: '12px', marginRight: '12px', color: '#94a3b8' }} />
                                }}
                                required
                            />

                            <Box sx={{ bgcolor: '#f1f0ff', p: 3, borderRadius: '16px', border: '1px solid #e0e0ff' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                    <Info size={18} color="#6c63ff" />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                        Total Days: <strong>{calculatedDays} days</strong>
                                    </Typography>
                                </Box>
                                <Typography variant="caption" sx={{ fontStyle: 'italic', color: '#64748b' }}>
                                    * Weekends and company holidays are automatically excluded.
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 3, borderTop: '1px solid #f1f5f9' }}>
                                <Button sx={{ color: '#64748b', fontWeight: 600, px: 3 }}>Cancel</Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        bgcolor: '#6c63ff',
                                        '&:hover': { bgcolor: '#5a52d5' },
                                        fontWeight: 700,
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 15px -3px rgba(108, 99, 255, 0.3)'
                                    }}
                                >
                                    Submit Request
                                </Button>
                            </Box>
                        </Box>
                    </Card>
                </Grid>

                <Grid item xs={12} lg={4}>
                    <Stack spacing={4}>
                        <Card sx={{ p: 3, borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', mb: 3 }}>
                                My Balances
                            </Typography>
                            <Stack spacing={3}>
                                {Object.entries(balances).map(([key, val]) => (
                                    <Box key={key}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#64748b', textTransform: 'capitalize' }}>
                                                {key} Leave
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 800, color: '#1e293b' }}>
                                                {val.total - val.used - val.pending} / {val.total}
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={((val.total - val.used - val.pending) / val.total) * 100}
                                            sx={{
                                                height: 8,
                                                borderRadius: 5,
                                                bgcolor: '#f1f5f9',
                                                '& .MuiLinearProgress-bar': {
                                                    borderRadius: 5,
                                                    bgcolor: key === 'annual' ? '#6c63ff' : key === 'sick' ? '#10b981' : '#fbbf24'
                                                }
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Stack>
                        </Card>

                        <Alert
                            icon={<AlertCircle size={20} />}
                            severity="warning"
                            sx={{
                                borderRadius: '24px',
                                bgcolor: '#fef3c7',
                                color: '#92400e',
                                '& .MuiAlert-icon': { color: '#92400e' }
                            }}
                        >
                            <AlertTitle sx={{ fontWeight: 800 }}>Leave Policy</AlertTitle>
                            <Box component="ul" sx={{ pl: 2, mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <li>Apply 2 days in advance</li>
                                <li>Med cert for {'>'} 2 sick days</li>
                                <li>Max 5 carry forward per year</li>
                            </Box>
                        </Alert>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ApplyLeave;



