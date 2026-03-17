export const mockHolidays = [
  { id: 1, date: '2024-01-01', name: "New Year's Day" },
  { id: 2, date: '2024-01-26', name: 'Republic Day' },
  { id: 3, date: '2024-03-25', name: 'Holi' },
  { id: 4, date: '2024-04-10', name: 'Eid al-Fitr' },
  { id: 5, date: '2024-08-15', name: 'Independence Day' },
  { id: 6, date: '2024-10-02', name: 'Gandhi Jayanti' },
  { id: 7, date: '2024-11-01', name: 'Diwali' },
  { id: 8, date: '2024-12-25', name: 'Christmas' },
];

export const leaveBalances = {
  annual: { total: 15, used: 5, pending: 2 },
  sick: { total: 10, used: 2, pending: 0 },
  casual: { total: 8, used: 3, pending: 1 },
};

export const mockLeaves = [
  {
    id: 'LV-001',
    employeeName: 'John Doe',
    type: 'Annual Leave',
    startDate: '2024-03-10',
    endDate: '2024-03-12',
    days: 3,
    status: 'approved',
    reason: 'Family trip',
    appliedDate: '2024-03-01',
  },
  {
    id: 'LV-002',
    employeeName: 'Jane Smith',
    type: 'Sick Leave',
    startDate: '2024-03-05',
    endDate: '2024-03-05',
    days: 1,
    status: 'pending',
    reason: 'High fever',
    appliedDate: '2024-03-04',
  },
  {
    id: 'LV-003',
    employeeName: 'Mike Wilson',
    type: 'Casual Leave',
    startDate: '2024-03-15',
    endDate: '2024-03-15',
    days: 0.5,
    status: 'pending',
    reason: 'Personal work',
    appliedDate: '2024-03-10',
  },
  {
    id: 'LV-004',
    employeeName: 'Sarah Connor',
    type: 'Annual Leave',
    startDate: '2024-02-10',
    endDate: '2024-02-15',
    days: 6,
    status: 'rejected',
    reason: 'Vacation',
    appliedDate: '2024-02-01',
    managerComment: 'Team already has multiple leaves on these dates.',
  },
];

export const mockTimesheets = [
  {
    id: 'TS-001',
    employeeName: 'John Doe',
    date: '2024-03-04',
    project: 'E-HRM Project',
    task: 'Development of sidebar and navigation components',
    hours: 8,
    status: 'approved',
  },
  {
    id: 'TS-002',
    employeeName: 'John Doe',
    date: '2024-03-05',
    project: 'E-HRM Project',
    task: 'Implementing leave calculation logic',
    hours: 7.5,
    status: 'pending',
  },
  {
    id: 'TS-003',
    employeeName: 'Jane Smith',
    date: '2024-03-05',
    project: 'Internal Dashboard',
    task: 'UX Design and Prototype review',
    hours: 8,
    status: 'pending',
  },
];

export const monthlyUsageData = [
  { name: 'Jan', leave: 2, timesheet: 160 },
  { name: 'Feb', leave: 4, timesheet: 152 },
  { name: 'Mar', leave: 3, timesheet: 40 },
  { name: 'Apr', leave: 0, timesheet: 0 },
  { name: 'May', leave: 0, timesheet: 0 },
  { name: 'Jun', leave: 0, timesheet: 0 },
];
