import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { mockLeaves, mockTimesheets, leaveBalances, mockHolidays } from '../data/mockData';

const LeaveContext = createContext();

const ROLE_LEVELS = {
    employee: 1,
    teamlead: 2,
    manager: 3,
    admin: 4
};

export const LeaveProvider = ({ children, currentUser }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    // Dynamic Data Store
    const [leaves, setLeaves] = useState(mockLeaves);
    const [timesheets, setTimesheets] = useState(mockTimesheets);
    const [balances, setBalances] = useState(leaveBalances);

    // Sync with external user
    useEffect(() => {
        if (currentUser) {
            setUser({
                ...currentUser,
                name: currentUser.name || currentUser.username || 'User',
                role: currentUser.role || 'employee',
                designation: currentUser.designation || 'Specialist',
                avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100'
            });
            setIsAuthenticated(true);
        } else {
            setUser(null);
            setIsAuthenticated(false);
        }
    }, [currentUser]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    }, []);

    const login = useCallback((userData) => {
        // Keeping for compatibility but sync useEffect handles it
        setUser(userData);
        setIsAuthenticated(true);
    }, []);

    const logout = useCallback(() => {
        setIsAuthenticated(false);
        setUser(null);
    }, []);

    const updateProfile = useCallback((data) => {
        setUser(prev => ({ ...prev, ...data }));
    }, []);

    const checkPermission = useCallback((requiredRole) => {
        if (!user) return false;
        const currentRole = user.role || 'employee';
        return ROLE_LEVELS[currentRole] >= ROLE_LEVELS[requiredRole];
    }, [user]);

    // Leave Management Functions
    const addLeave = useCallback((newLeave) => {
        if (!user) return false;
        const leaveWithId = {
            ...newLeave,
            id: `LV-00${leaves.length + 1}`,
            employeeName: user.name,
            status: 'pending',
            appliedDate: new Date().toISOString().split('T')[0]
        };
        setLeaves(prev => [leaveWithId, ...prev]);

        // Update local balances (simulated)
        const typeKey = newLeave.type.split(' ')[0].toLowerCase(); // annual, sick, casual
        if (balances[typeKey]) {
            setBalances(prev => ({
                ...prev,
                [typeKey]: {
                    ...prev[typeKey],
                    pending: prev[typeKey].pending + 1
                }
            }));
        }
        return true;
    }, [leaves.length, user, balances]);

    const updateLeaveStatus = useCallback((id, status, comment) => {
        setLeaves(prev => prev.map(leave => {
            if (leave.id === id) {
                // If approved, move from pending to used
                if (status === 'approved') {
                    const typeKey = leave.type.split(' ')[0].toLowerCase();
                    setBalances(prevBal => {
                        const current = prevBal[typeKey];
                        if (!current) return prevBal;
                        return {
                            ...prevBal,
                            [typeKey]: {
                                ...current,
                                pending: Math.max(0, current.pending - 1),
                                used: current.used + leave.days
                            }
                        };
                    });
                } else if (status === 'rejected') {
                    const typeKey = leave.type.split(' ')[0].toLowerCase();
                    setBalances(prevBal => {
                        const current = prevBal[typeKey];
                        if (!current) return prevBal;
                        return {
                            ...prevBal,
                            [typeKey]: {
                                ...current,
                                pending: Math.max(0, current.pending - 1)
                            }
                        };
                    });
                }
                return { ...leave, status, managerComment: comment };
            }
            return leave;
        }));
    }, []);

    // Timesheet Management
    const addTimesheet = useCallback((newTS) => {
        if (!user) return false;
        const tsWithId = {
            ...newTS,
            id: `TS-00${timesheets.length + 1}`,
            employeeName: user.name,
            status: 'pending',
            date: newTS.date || new Date().toISOString().split('T')[0]
        };
        setTimesheets(prev => [tsWithId, ...prev]);
        return true;
    }, [timesheets.length, user]);

    const updateTimesheetStatus = useCallback((id, status) => {
        setTimesheets(prev => prev.map(ts => ts.id === id ? { ...ts, status } : ts));
    }, []);

    const contextValue = useMemo(() => ({
        user,
        isAuthenticated,
        isCollapsed,
        setIsCollapsed,
        theme,
        toggleTheme,
        login,
        logout,
        updateProfile,
        checkPermission,
        leaves,
        timesheets,
        balances,
        addLeave,
        updateLeaveStatus,
        addTimesheet,
        updateTimesheetStatus,
        holidays: mockHolidays
    }), [
        user, isAuthenticated, isCollapsed, theme, toggleTheme, login, logout,
        updateProfile, checkPermission, leaves, timesheets, balances,
        addLeave, updateLeaveStatus, addTimesheet, updateTimesheetStatus
    ]);

    return (
        <LeaveContext.Provider value={contextValue}>
            {children}
        </LeaveContext.Provider>
    );
};

export const useLeave = () => useContext(LeaveContext);

