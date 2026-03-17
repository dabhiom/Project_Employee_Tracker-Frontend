import React, { useState } from 'react';

import { useLeave } from '../../Context/LeaveContext';
import { User, Lock, Bell, Camera, Save, CheckCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import {
    Box,
    Grid,
    Card,
    Typography,
    Tabs,
    Tab,
    TextField,
    Button,
    Avatar,
    IconButton,
    Switch,
    FormControlLabel,
    Stack,
    Divider,
    Paper
} from '@mui/material';
const Settings = () => {
    const { user, updateProfile } = useLeave();
    const [activeTab, setActiveTab] = React.useState(0);

    if (!user) return <Box sx={{ p: 4 }}><Typography>Loading...</Typography></Box>;

    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || 'admin@tecnoprism.com',
        designation: user?.designation || '',
        bio: 'Software Developer passionate about building high-quality applications.'
    });

    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const saveProfile = (e) => {
        e.preventDefault();
        updateProfile({ name: profileData.name, designation: profileData.designation });
        toast.success('Profile updated successfully!');
    };

    const savePassword = (e) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            toast.error('Passwords do not match');
            return;
        }
        toast.success('Password changed successfully!');
        setPasswordData({ current: '', new: '', confirm: '' });
    };

    return (
        <Box>
            <Toaster position="top-right" />
            <Grid container spacing={4}>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        <Tabs
                            orientation="vertical"
                            value={activeTab}
                            onChange={handleTabChange}
                            sx={{
                                borderRight: 1,
                                borderColor: 'divider',
                                py: 2,
                                '& .MuiTab-root': {
                                    alignItems: 'flex-start',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: '0.925rem',
                                    py: 1.5,
                                    px: 3,
                                    minHeight: 'auto',
                                    color: '#64748b',
                                    '&.Mui-selected': { color: 'primary.main', bgcolor: '#eff6ff' }
                                },
                                '& .MuiTabs-indicator': { left: 0, width: 4, borderRadius: '0 4px 4px 0' }
                            }}
                        >
                            <Tab icon={<User size={18} />} iconPosition="start" label="Profile" />
                            <Tab icon={<Lock size={18} />} iconPosition="start" label="Password" />
                            <Tab icon={<Bell size={18} />} iconPosition="start" label="Notifications" />
                        </Tabs>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={9}>
                    <Card sx={{ p: { xs: 3, md: 5 }, borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        {activeTab === 0 && (
                            <Box component="form" onSubmit={saveProfile} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>Public Profile</Typography>
                                    <Typography variant="body2" color="text.secondary">Update your personal information and profile picture.</Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 3, bgcolor: '#f8fafc', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
                                    <Box sx={{ position: 'relative' }}>
                                        <Avatar src={user?.avatar} sx={{ width: 80, height: 80, borderRadius: '24px' }} />
                                        <IconButton
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                bottom: -4,
                                                right: -4,
                                                bgcolor: '#fff',
                                                border: '1px solid #e2e8f0',
                                                '&:hover': { bgcolor: '#f8fafc' }
                                            }}
                                        >
                                            <Camera size={16} />
                                        </IconButton>
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Profile Picture</Typography>
                                        <Typography variant="caption" color="text.secondary">PNG, JPG or GIF. Max 800K.</Typography>
                                    </Box>
                                </Box>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Full Name"
                                            name="name"
                                            value={profileData.name}
                                            onChange={handleProfileChange}
                                            InputProps={{ sx: { borderRadius: '12px' } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Email Address"
                                            value={profileData.email}
                                            disabled
                                            InputProps={{ sx: { borderRadius: '12px', bgcolor: '#f8fafc' } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Designation"
                                            name="designation"
                                            value={profileData.designation}
                                            onChange={handleProfileChange}
                                            InputProps={{ sx: { borderRadius: '12px' } }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Phone Number"
                                            defaultValue="+1 (555) 000-0000"
                                            InputProps={{ sx: { borderRadius: '12px' } }}
                                        />
                                    </Grid>
                                </Grid>

                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Bio"
                                    name="bio"
                                    value={profileData.bio}
                                    onChange={handleProfileChange}
                                    InputProps={{ sx: { borderRadius: '12px' } }}
                                />

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2, borderTop: '1px solid #f1f5f9' }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={<Save size={18} />}
                                        sx={{ borderRadius: '12px', px: 4, py: 1.2, fontWeight: 700, textTransform: 'none', boxShadow: 'none' }}
                                    >
                                        Save Changes
                                    </Button>
                                </Box>
                            </Box>
                        )}

                        {activeTab === 1 && (
                            <Box component="form" onSubmit={savePassword} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>Password Management</Typography>
                                    <Typography variant="body2" color="text.secondary">Secure your account with a strong password.</Typography>
                                </Box>

                                <Stack spacing={3}>
                                    <TextField
                                        fullWidth
                                        type="password"
                                        label="Current Password"
                                        name="current"
                                        value={passwordData.current}
                                        onChange={handlePasswordChange}
                                        placeholder="Enter current password"
                                        required
                                        InputProps={{ sx: { borderRadius: '12px' } }}
                                    />
                                    <TextField
                                        fullWidth
                                        type="password"
                                        label="New Password"
                                        name="new"
                                        value={passwordData.new}
                                        onChange={handlePasswordChange}
                                        placeholder="Enter new password"
                                        required
                                        InputProps={{ sx: { borderRadius: '12px' } }}
                                    />
                                    <TextField
                                        fullWidth
                                        type="password"
                                        label="Confirm New Password"
                                        name="confirm"
                                        value={passwordData.confirm}
                                        onChange={handlePasswordChange}
                                        placeholder="Confirm new password"
                                        required
                                        InputProps={{ sx: { borderRadius: '12px' } }}
                                    />
                                </Stack>

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2, borderTop: '1px solid #f1f5f9' }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={<Save size={18} />}
                                        sx={{ borderRadius: '12px', px: 4, py: 1.2, fontWeight: 700, textTransform: 'none', boxShadow: 'none' }}
                                    >
                                        Update Password
                                    </Button>
                                </Box>
                            </Box>
                        )}

                        {activeTab === 2 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>Notification Settings</Typography>
                                    <Typography variant="body2" color="text.secondary">Choose how you want to be notified.</Typography>
                                </Box>

                                <Stack spacing={2}>
                                    {[
                                        { title: 'Email Notifications', desc: 'Receive daily updates and alerts via email.' },
                                        { title: 'Desktop Alerts', desc: 'Show browser notifications for urgent tasks.' },
                                        { title: 'New Leave Requests', desc: 'Get notified when a team member applies for leave.' },
                                        { title: 'Timesheet Reminders', desc: 'Remind me to log my hours at the end of the day.' }
                                    ].map((notif, i) => (
                                        <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderRadius: '16px', border: '1px solid #f1f5f9', '&:hover': { bgcolor: '#f8fafc' } }}>
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{notif.title}</Typography>
                                                <Typography variant="caption" color="text.secondary">{notif.desc}</Typography>
                                            </Box>
                                            <Switch defaultChecked={i < 2} color="primary" />
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>
                        )}
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Settings;



