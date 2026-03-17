import React from 'react';
import { useLeave } from '../../Context/LeaveContext';
import {
    MoreHorizontal,
    Search,
    Mail,
    Bell,
    Moon,
    Users,
    Briefcase,
    ClipboardList,
    TrendingUp,
    Clock,
    CheckCircle
} from 'lucide-react';

import {
    Box,
    Grid,
    Card,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    IconButton,
    styled,
    useTheme,
    Stack
} from '@mui/material';

const BannerCard = styled(Card)(({ theme }) => ({
    background: '#6c63ff',
    borderRadius: '24px',
    padding: theme.spacing(4),
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: 'none',
}));

const LeaveDashboard = ({ onApplyLeave }) => {
    const { user } = useLeave();
    const theme = useTheme();

    if (!user) return <Box sx={{ p: 4 }}><Typography>Loading...</Typography></Box>;

    const recruitmentData = [
        { name: 'Mary G. Schueller', role: 'Project Manager', status: 'Tech Interview', color: '#f87171' },
        { name: 'Lawrence A. Mason', role: 'Fix Developer', status: 'Task', color: '#fbbf24' },
        { name: 'Jimmy C. Wilson', role: 'Senior JS Developer', status: 'Resume Review', color: '#6366f1' },
        { name: 'Vivian J. Joseph', role: 'Junior UI Designer', status: 'Final Interview', color: '#10b981' },
    ];

    const stats = [
        { label: 'Total Employees', value: '45', icon: <Users size={28} />, color: '#10b981', trend: '+2.5%', sub: 'vs last month' },
        { label: 'Active Projects', value: '12', icon: <Briefcase size={28} />, color: '#8b5cf6', trend: '+1.2%', sub: 'vs last week' },
        { label: 'Pending Leaves', value: '05', icon: <ClipboardList size={28} />, color: '#3b82f6', trend: '-0.5%', sub: 'vs yesterday' },
        { label: 'Bounce Rate', value: '47%', icon: <TrendingUp size={28} />, color: '#f97316', trend: '+2.1%', sub: 'vs last month' },
    ];

    const recentActivity = [
        { user: 'Bob S.', action: 'applied for leave', time: '2 hours ago', icon: <Clock size={16} /> },
        { user: 'Finance', action: 'budget approved', time: '5 hours ago', icon: <CheckCircle size={16} /> },
        { user: 'System', action: 'new member added', time: '1 day ago', icon: <Users size={16} /> },
        { user: 'Admin', action: 'policy updated', time: '2 days ago', icon: <Mail size={16} /> },
    ];

    return (
        <Box>
            <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1600px', mx: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#fff', px: 2, py: 1, borderRadius: '12px', width: '300px', border: '1px solid #f1f5f9' }}>
                        <Search size={18} color="#94a3b8" />
                        <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem' }}>Search for anything...</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <IconButton size="small" sx={{ bgcolor: '#fff', border: '1px solid #f1f5f9', borderRadius: '10px' }}>
                            <Mail size={20} color="#64748b" />
                        </IconButton>
                        <IconButton size="small" sx={{ bgcolor: '#fff', border: '1px solid #f1f5f9', borderRadius: '10px' }}>
                            <Bell size={20} color="#64748b" />
                        </IconButton>
                        <IconButton size="small" sx={{ bgcolor: '#fff', border: '1px solid #f1f5f9', borderRadius: '10px' }}>
                            <Moon size={20} color="#64748b" />
                        </IconButton>
                        <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar src={user?.avatar} sx={{ width: 40, height: 40, border: '2px solid #6c63ff' }} />
                            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>{user?.name}</Typography>
                                <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>Project Manager</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <BannerCard sx={{ mb: 4, py: 4, px: 5, boxShadow: '0 10px 30px -10px rgba(108, 99, 255, 0.4)' }}>
                    <Box sx={{ zIndex: 2, flex: 1 }}>
                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                            Hello {user?.name}!
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9, mb: 3, fontWeight: 500 }}>
                            Welcome back to your dashboard. You have 9 new notifications today.
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={onApplyLeave}
                            sx={{
                                bgcolor: '#fff',
                                color: '#6c63ff',
                                '&:hover': { bgcolor: '#f8fafc' },
                                fontWeight: 800,
                                px: 4,
                                py: 1.5,
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontSize: '1rem'
                            }}
                        >
                            Apply Leave
                        </Button>
                    </Box>
                    <Box sx={{ width: '280px', display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
                        <img
                            src="https://img.freepik.com/free-vector/modern-girl-working-laptop_114360-1248.jpg"
                            alt="Dashboard Illustration"
                            style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))' }}
                        />
                    </Box>
                </BannerCard>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {stats.map((stat, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card sx={{
                                p: 3,
                                borderRadius: '20px',
                                bgcolor: stat.color,
                                color: '#fff',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: '0 12px 24px -6px rgba(0,0,0,0.12)',
                                transition: 'transform 0.3s ease',
                                '&:hover': { transform: 'translateY(-5px)' },
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Box>
                                        <Typography variant="h2" sx={{ fontWeight: 900, mb: 0.5, letterSpacing: '-1px' }}>{stat.value}</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 700, opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.8rem' }}>{stat.label}</Typography>
                                    </Box>
                                    <Box sx={{ p: 1, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '12px' }}>
                                        {stat.icon}
                                    </Box>
                                </Box>
                                <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 800, bgcolor: 'rgba(255,255,255,0.25)', px: 1, py: 0.5, borderRadius: '6px' }}>
                                        {stat.trend}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 600 }}>{stat.sub}</Typography>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Grid container spacing={3}>
                    <Grid item xs={12} lg={8}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Card sx={{ borderRadius: '20px', p: 4, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', bgcolor: '#fff' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
                                        Recruitment Progress
                                    </Typography>
                                    <IconButton><MoreHorizontal /></IconButton>
                                </Box>
                                <TableContainer sx={{ border: '1px solid #f1f5f9', borderRadius: '12px' }}>
                                    <Table>
                                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Full Name</TableCell>
                                                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Designation</TableCell>
                                                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Status</TableCell>
                                                <TableCell align="right">Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {recruitmentData.map((item, idx) => (
                                                <TableRow key={idx} hover sx={{ '&:last-child td': { border: 0 } }}>
                                                    <TableCell sx={{ py: 2 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <Avatar sx={{ bgcolor: '#f1f5f9', color: '#64748b' }}>{item.name.charAt(0)}</Avatar>
                                                            <Typography sx={{ fontWeight: 600 }}>{item.name}</Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#64748b' }}>{item.role}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color }} />
                                                            <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.status}</Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Button size="small" variant="text" sx={{ textTransform: 'none', fontWeight: 600 }}>View</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Card>

                            <Card sx={{ borderRadius: '20px', p: 4, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', bgcolor: '#fff' }}>
                                <Typography variant="h5" sx={{ fontWeight: 800, mb: 4, color: '#1e293b' }}>Recent Activity</Typography>
                                <Stack spacing={3}>
                                    {recentActivity.map((activity, i) => (
                                        <Box key={i} sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                                            <Avatar sx={{ width: 48, height: 48, bgcolor: '#f1f5f9', color: '#6c63ff' }}>
                                                {activity.icon}
                                            </Avatar>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>
                                                    {activity.user} <span style={{ fontWeight: 400, color: '#64748b' }}>{activity.action}</span>
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#94a3b8' }}>{activity.time}</Typography>
                                            </Box>
                                            <Button size="small" sx={{ color: '#94a3b8', textTransform: 'none' }}>Details</Button>
                                        </Box>
                                    ))}
                                </Stack>
                            </Card>
                        </Box>
                    </Grid>

                    <Grid item xs={12} lg={4}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Card sx={{ borderRadius: '20px', p: 4, textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', bgcolor: '#fff' }}>
                                <Avatar
                                    src={user?.avatar}
                                    sx={{ width: 100, height: 100, mx: 'auto', mb: 2, border: '4px solid #f1f5f9' }}
                                />
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>{user?.name}</Typography>
                                <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>{user?.designation}</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
                                    {[ '📞', '✉️', '💬'].map((icon, i) => (
                                        <IconButton key={i} sx={{ bgcolor: '#f8fafc', borderRadius: '12px', width: 48, height: 48 }}>{icon}</IconButton>
                                    ))}
                                </Box>
                                <Box sx={{ pt: 3, borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {[
                                        { label: 'Company', val: 'Tecnoprism' },
                                        { label: 'Joining', val: '05/04/2018' },
                                        { label: 'Projects', val: '24 Active' }
                                    ].map((s, i) => (
                                        <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>{s.label}</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{s.val}</Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Card>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default LeaveDashboard;
