import React, { useState } from 'react';

import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays,
    eachDayOfInterval
} from 'date-fns';
import { useLeave } from '../../Context/LeaveContext';

import {
    Box,
    Card,
    Typography,
    IconButton,
    Button,
    Grid,
    Stack,
    Tooltip,
    Paper
} from '@mui/material';

const CalendarView = ({ onApplyLeave }) => {
    const { leaves, holidays, user } = useLeave();
    const [currentMonth, setCurrentMonth] = useState(new Date());

    if (!user) return <Box sx={{ p: 4 }}><Typography>Loading...</Typography></Box>;

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const renderHeader = () => {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Stack direction="row" spacing={3} alignItems="center">
                    <Typography variant="h5" sx={{ fontWeight: 800, minWidth: 200, color: '#1e293b' }}>
                        {format(currentMonth, 'MMMM yyyy')}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <IconButton
                            onClick={prevMonth}
                            sx={{ border: '1px solid #e2e8f0', borderRadius: '10px', bgcolor: '#fff' }}
                        >
                            <ChevronLeft size={20} />
                        </IconButton>
                        <IconButton
                            onClick={nextMonth}
                            sx={{ border: '1px solid #e2e8f0', borderRadius: '10px', bgcolor: '#fff' }}
                        >
                            <ChevronRight size={20} />
                        </IconButton>
                    </Stack>
                </Stack>
                <Stack direction="row" spacing={4} alignItems="center">
                    <Stack direction="row" spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
                            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>Leave</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f59e0b' }} />
                            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>Holiday</Typography>
                        </Box>
                    </Stack>
                    <Button
                        variant="contained"
                        onClick={onApplyLeave}
                        startIcon={<Plus size={18} />}
                        sx={{
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontWeight: 700,
                            bgcolor: 'primary.main',
                            boxShadow: 'none'
                        }}
                    >
                        Apply Leave
                    </Button>
                </Stack>
            </Box>
        );
    };

    const renderDays = () => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', bgcolor: '#fafafa', borderBottom: '1px solid #e2e8f0', borderRadius: '12px 12px 0 0' }}>
                {days.map((day, i) => (
                    <Box key={i} sx={{ py: 2, textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {day}
                        </Typography>
                    </Box>
                ))}
            </Box>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const rows = [];
        let daysArray = [];
        let day = startDate;

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const dayCopy = day; // local copy
                const formattedDate = format(day, "d");
                const holiday = holidays.find(h => isSameDay(new Date(h.date), dayCopy));
                const dayLeaves = leaves.filter(l => {
                    const start = new Date(l.startDate);
                    const end = new Date(l.endDate);
                    return dayCopy >= start && dayCopy <= end && l.status === 'approved';
                });

                const isToday = isSameDay(day, new Date());
                const isCurrentMonth = isSameMonth(day, monthStart);

                daysArray.push(
                    <Box
                        key={day.toString()}
                        sx={{
                            height: 120,
                            p: 1.5,
                            borderRight: '1px solid #e2e8f0',
                            borderBottom: '1px solid #e2e8f0',
                            bgcolor: isToday ? '#f0f4ff' : 'transparent',
                            color: !isCurrentMonth ? '#cbd5e1' : '#1e293b',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.5,
                            transition: 'background-color 0.2s',
                            '&:hover': { bgcolor: isToday ? '#e2e8ff' : '#f8fafc' }
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 32,
                            height: 32,
                            borderRadius: '8px',
                            bgcolor: isToday ? 'primary.main' : 'transparent',
                            color: isToday ? '#fff' : 'inherit',
                            mb: 0.5
                        }}>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                {formattedDate}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, overflowY: 'auto', flex: 1, '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { bgcolor: '#cbd5e1', borderRadius: '4px' } }}>
                            {holiday && (
                                <Tooltip title={holiday.name}>
                                    <Box sx={{
                                        fontSize: '0.7rem',
                                        py: 0.5,
                                        px: 1,
                                        bgcolor: '#fffbeb',
                                        color: '#92400e',
                                        borderRadius: '4px',
                                        borderLeft: '3px solid #f59e0b',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {holiday.name}
                                    </Box>
                                </Tooltip>
                            )}
                            {dayLeaves.map((leave, idx) => (
                                <Tooltip key={idx} title={`${leave.employeeName}: ${leave.type}`}>
                                    <Box sx={{
                                        fontSize: '0.7rem',
                                        py: 0.5,
                                        px: 1,
                                        bgcolor: '#eff6ff',
                                        color: 'primary.main',
                                        borderRadius: '4px',
                                        borderLeft: '3px solid',
                                        borderColor: 'primary.main',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {leave.employeeName.split(' ')[0]}
                                    </Box>
                                </Tooltip>
                            ))}
                        </Box>
                    </Box>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <Box key={day.toString()} sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                    {daysArray}
                </Box>
            );
            daysArray = [];
        }
        return <Box sx={{ borderLeft: '1px solid #e2e8f0', borderTop: '1px solid #e2e8f0', borderRadius: '0 0 12px 12px', overflow: 'hidden' }}>{rows}</Box>;
    };

    return (
        <Box>
            <Paper sx={{ p: 4, borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                {renderHeader()}
                {renderDays()}
                {renderCells()}
            </Paper>
        </Box>
    );
};

export default CalendarView;



