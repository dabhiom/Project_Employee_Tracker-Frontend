import { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'
import MemoryIcon from '@mui/icons-material/Memory'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import PendingIcon from '@mui/icons-material/Pending'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AddIcon from '@mui/icons-material/Add'
import PieChartIcon from '@mui/icons-material/PieChart'
import BarChartIcon from '@mui/icons-material/BarChart'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'

// ─── Mock KPI Data ────────────────────────────────────────────────────────────
const kpiCards = [
  {
    title: 'Total Processes',
    value: 35,
    description: 'All automation processes tracked',
    icon: <MemoryIcon sx={{ fontSize: 36, color: '#3b82f6' }} />,
    accent: '#3b82f6',
    bg: 'rgba(59,130,246,0.07)',
  },
  {
    title: 'Bots Developed',
    value: 48,
    description: 'Total bots built across all clients',
    icon: <SmartToyIcon sx={{ fontSize: 36, color: '#8b5cf6' }} />,
    accent: '#8b5cf6',
    bg: 'rgba(139,92,246,0.07)',
  },
  {
    title: 'Processes In Progress',
    value: 12,
    description: 'Currently active automations',
    icon: <PendingIcon sx={{ fontSize: 36, color: '#f59e0b' }} />,
    accent: '#f59e0b',
    bg: 'rgba(245,158,11,0.07)',
  },
  {
    title: 'Completed Automations',
    value: 20,
    description: 'Successfully delivered projects',
    icon: <CheckCircleIcon sx={{ fontSize: 36, color: '#22c55e' }} />,
    accent: '#22c55e',
    bg: 'rgba(34,197,94,0.07)',
  },
]

// ─── Chart Data ───────────────────────────────────────────────────────────────
const platformData = [
  { name: 'Web Automation', value: 12 },
  { name: 'Windows Automation', value: 8 },
  { name: 'Citrix', value: 5 },
  { name: 'API Automation', value: 10 },
]

const clientData = [
  { client: 'Infosys', bots: 6 },
  { client: 'TCS', bots: 4 },
  { client: 'Wipro', bots: 3 },
  { client: 'HCL', bots: 5 },
]

const PIE_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6']

// ─── Mock Process Table Data ─────────────────────────────────────────────────
const processRows = [
  {
    processName: 'Invoice Processing Bot',
    client: 'Infosys',
    developer: 'Rahul Sharma',
    platform: 'Web',
    botsDeveloped: 3,
    status: 'Completed',
    startDate: '01 Jan 2024',
  },
  {
    processName: 'HR Onboarding Automation',
    client: 'TCS',
    developer: 'Priya Patel',
    platform: 'Windows',
    botsDeveloped: 2,
    status: 'In Progress',
    startDate: '15 Feb 2024',
  },
  {
    processName: 'Data Migration Tool',
    client: 'Wipro',
    developer: 'Amit Kumar',
    platform: 'API',
    botsDeveloped: 1,
    status: 'On Hold',
    startDate: '10 Mar 2024',
  },
  {
    processName: 'Claims Processing',
    client: 'HCL',
    developer: 'Sneha Reddy',
    platform: 'Citrix',
    botsDeveloped: 4,
    status: 'Completed',
    startDate: '05 Dec 2023',
  },
  {
    processName: 'Report Generation Bot',
    client: 'Infosys',
    developer: 'Vikram Singh',
    platform: 'Web',
    botsDeveloped: 2,
    status: 'In Progress',
    startDate: '20 Apr 2024',
  },
  {
    processName: 'Email Classification',
    client: 'TCS',
    developer: 'Ananya Gupta',
    platform: 'API',
    botsDeveloped: 1,
    status: 'Yet To Start',
    startDate: '01 Jun 2024',
  },
  {
    processName: 'Payroll Automation',
    client: 'HCL',
    developer: 'Rajesh Nair',
    platform: 'Windows',
    botsDeveloped: 3,
    status: 'Completed',
    startDate: '15 Nov 2023',
  },
]

// ─── Status Chip Colors ──────────────────────────────────────────────────────
const statusColor = {
  Completed: 'success',
  'In Progress': 'warning',
  'On Hold': 'error',
  'Yet To Start': 'default',
}

// ─── Form Options ─────────────────────────────────────────────────────────────
const employeeOptions = [
  'Rahul Sharma',
  'Priya Patel',
  'Amit Kumar',
  'Sneha Reddy',
  'Vikram Singh',
  'Ananya Gupta',
  'Rajesh Nair',
]

const projectTypeOptions = [
  'Migration',
  'POC',
  'Project',
  'Support',
  'Training',
  'Walkthrough',
]

const projectStatusOptions = [
  'Completed',
  'In Progress',
  'On Hold',
  'Yet To Start',
]

const platformOptions = ['API', 'Citrix', 'Web', 'Windows', 'Other']

const toolsOptions = [
  'Abbyy',
  'APIs',
  'Blue Prism',
  'UiPath',
  'Automation Anywhere',
  'Power Automate',
  'Python',
  'Selenium',
]

function BotWarehousePage() {
  const [formOpen, setFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    team: '',
    employeeName: null,
    customerName: '',
    clientName: '',
    role: '',
    industryType: '',
    departmentName: '',
    processName: '',
    processDescription: '',
    projectType: '',
    projectStatus: '',
    projectStartDate: '',
    projectEndDate: '',
    numberOfBots: '',
    platformAutomated: '',
    toolsUsed: [],
    targetApplication: '',
    comments: '',
  })

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleClose = () => {
    setFormOpen(false)
    setFormData({
      team: '',
      employeeName: null,
      customerName: '',
      clientName: '',
      role: '',
      industryType: '',
      departmentName: '',
      processName: '',
      processDescription: '',
      projectType: '',
      projectStatus: '',
      projectStartDate: '',
      projectEndDate: '',
      numberOfBots: '',
      platformAutomated: '',
      toolsUsed: [],
      targetApplication: '',
      comments: '',
    })
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box>

        {/* ── Section 1: Page Header ── */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ color: '#0f172a', letterSpacing: '-0.5px' }}
          >
            Bot Warehouse
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', mt: 0.5 }}>
            Track automation processes, deployed bots, and automation metrics.
          </Typography>
          <Divider sx={{ mt: 2.5, borderColor: '#e2e8f0' }} />
        </Box>

        {/* ── Section 2: KPI Metric Cards ── */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            mb: 4,
            flexWrap: 'nowrap',
          }}
        >
          {kpiCards.map((card) => (
            <Card
              key={card.title}
              elevation={0}
              sx={{
                flex: '1 1 0',
                minWidth: 0,
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1.5,
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{
                      color: '#475569',
                      fontSize: '0.72rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      lineHeight: 1.3,
                      pr: 1,
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: card.bg,
                      borderRadius: 2,
                      p: 0.7,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
                <Typography
                  variant="h3"
                  fontWeight={800}
                  sx={{
                    color: '#0f172a',
                    lineHeight: 1,
                    mb: 0.6,
                    fontSize: { xs: '1.8rem', lg: '2.5rem' },
                  }}
                >
                  {card.value}
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  {card.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* ── Section 3: Automation Analytics ── */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
          {/* Automation by Platform — Pie Chart */}
          <Card
            elevation={0}
            sx={{
              flex: '1 1 0',
              minWidth: { xs: '100%', md: 0 },
              borderRadius: 3,
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PieChartIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
                <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#0f172a' }}>
                  Automation by Platform
                </Typography>
              </Box>
              <Divider sx={{ mb: 3, borderColor: '#f1f5f9' }} />
              <Box sx={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: '0.78rem', paddingTop: 8 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>

          {/* Bots Developed by Client — Bar Chart */}
          <Card
            elevation={0}
            sx={{
              flex: '1 1 0',
              minWidth: { xs: '100%', md: 0 },
              borderRadius: 3,
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <BarChartIcon sx={{ color: '#8b5cf6', fontSize: 20 }} />
                <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#0f172a' }}>
                  Bots Developed by Client
                </Typography>
              </Box>
              <Divider sx={{ mb: 3, borderColor: '#f1f5f9' }} />
              <Box sx={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clientData} margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="client"
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                      width={32}
                      allowDecimals={false}
                    />
                    <RechartsTooltip
                      formatter={(value) => [value, 'Bots']}
                      cursor={{ fill: 'rgba(139,92,246,0.06)' }}
                    />
                    <Bar dataKey="bots" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={48} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* ── Section 4 & 5: Process Table with Add Button ── */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2.5,
              }}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#0f172a' }}>
                  Automation Processes
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  Complete list of all automation processes with current status
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setFormOpen(true)}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  fontWeight: 600,
                  px: 2.5,
                  boxShadow: '0 4px 12px rgba(15, 98, 254, 0.25)',
                }}
              >
                Add Automation Process
              </Button>
            </Box>
            <Divider sx={{ mb: 2, borderColor: '#f1f5f9' }} />

            <TableContainer
              component={Paper}
              elevation={0}
              sx={{ borderRadius: 2, border: '1px solid #f1f5f9' }}
            >
              <Table sx={{ minWidth: 850 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                    {[
                      'Process Name',
                      'Client',
                      'Developer',
                      'Platform',
                      'Bots Developed',
                      'Status',
                      'Start Date',
                    ].map((heading) => (
                      <TableCell
                        key={heading}
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          color: '#475569',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          borderBottom: '1px solid #e2e8f0',
                          py: 1.5,
                        }}
                      >
                        {heading}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {processRows.map((row, index) => (
                    <TableRow
                      key={row.processName}
                      sx={{
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafbfc',
                        '&:hover': { backgroundColor: '#f9fafb' },
                        '&:last-child td': { borderBottom: 0 },
                        transition: 'background-color 0.15s',
                      }}
                    >
                      <TableCell
                        sx={{ fontWeight: 600, color: '#1e40af', fontSize: '0.85rem', py: 1.8 }}
                      >
                        {row.processName}
                      </TableCell>
                      <TableCell sx={{ color: '#0f172a', fontSize: '0.85rem', py: 1.8 }}>
                        {row.client}
                      </TableCell>
                      <TableCell sx={{ color: '#334155', fontSize: '0.85rem', py: 1.8 }}>
                        {row.developer}
                      </TableCell>
                      <TableCell sx={{ color: '#334155', fontSize: '0.85rem', py: 1.8 }}>
                        {row.platform}
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.85rem', py: 1.8 }}
                      >
                        {row.botsDeveloped}
                      </TableCell>
                      <TableCell sx={{ py: 1.8 }}>
                        <Chip
                          label={row.status}
                          color={statusColor[row.status]}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            borderRadius: '6px',
                            minWidth: 90,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#64748b', fontSize: '0.85rem', py: 1.8 }}>
                        {row.startDate}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* ── Section 6: Add Process Modal Form ── */}
        <Dialog
          open={formOpen}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          scroll="paper"
          PaperProps={{
            sx: { borderRadius: 3, maxHeight: '90vh' },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, color: '#0f172a', pb: 1, fontSize: '1.25rem' }}>
            Add Automation Process
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ pt: 3, px: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* Row 1 */}
              <Box sx={{ display: 'flex', gap: 2.5 }}>
                <TextField
                  label="Team"
                  fullWidth
                  value={formData.team}
                  onChange={handleChange('team')}
                />
                <Autocomplete
                  fullWidth
                  options={employeeOptions}
                  value={formData.employeeName}
                  onChange={(e, val) =>
                    setFormData((prev) => ({ ...prev, employeeName: val }))
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Employee Name" />
                  )}
                />
              </Box>
              {/* Row 2 */}
              <Box sx={{ display: 'flex', gap: 2.5 }}>
                <TextField
                  label="Customer Name"
                  fullWidth
                  value={formData.customerName}
                  onChange={handleChange('customerName')}
                />
                <TextField
                  label="Client Name"
                  fullWidth
                  value={formData.clientName}
                  onChange={handleChange('clientName')}
                />
              </Box>
              {/* Row 3 */}
              <Box sx={{ display: 'flex', gap: 2.5 }}>
                <TextField
                  label="Role"
                  fullWidth
                  value={formData.role}
                  onChange={handleChange('role')}
                />
                <TextField
                  label="Industry Type"
                  fullWidth
                  value={formData.industryType}
                  onChange={handleChange('industryType')}
                />
              </Box>
              {/* Row 4 */}
              <Box sx={{ display: 'flex', gap: 2.5 }}>
                <TextField
                  label="Department Name"
                  fullWidth
                  value={formData.departmentName}
                  onChange={handleChange('departmentName')}
                />
                <TextField
                  label="Process Name"
                  fullWidth
                  value={formData.processName}
                  onChange={handleChange('processName')}
                />
              </Box>
              {/* Row 5 — full width */}
              <TextField
                label="Process Description"
                fullWidth
                multiline
                rows={3}
                value={formData.processDescription}
                onChange={handleChange('processDescription')}
              />
              {/* Row 6 */}
              <Box sx={{ display: 'flex', gap: 2.5 }}>
                <FormControl fullWidth>
                  <InputLabel>Project Type</InputLabel>
                  <Select
                    label="Project Type"
                    value={formData.projectType}
                    onChange={handleChange('projectType')}
                  >
                    {projectTypeOptions.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Project Status</InputLabel>
                  <Select
                    label="Project Status"
                    value={formData.projectStatus}
                    onChange={handleChange('projectStatus')}
                  >
                    {projectStatusOptions.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              {/* Row 7 */}
              <Box sx={{ display: 'flex', gap: 2.5 }}>
                <FormControl fullWidth>
                  <InputLabel>Platform Automated</InputLabel>
                  <Select
                    label="Platform Automated"
                    value={formData.platformAutomated}
                    onChange={handleChange('platformAutomated')}
                  >
                    {platformOptions.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Number of Bots Developed"
                  type="number"
                  fullWidth
                  value={formData.numberOfBots}
                  onChange={handleChange('numberOfBots')}
                />
              </Box>
              {/* Row 8 */}
              <Box sx={{ display: 'flex', gap: 2.5 }}>
                <TextField
                  label="Project Start Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formData.projectStartDate}
                  onChange={handleChange('projectStartDate')}
                />
                <TextField
                  label="Project End Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formData.projectEndDate}
                  onChange={handleChange('projectEndDate')}
                />
              </Box>
              {/* Row 9 */}
              <Box sx={{ display: 'flex', gap: 2.5 }}>
                <Autocomplete
                  multiple
                  fullWidth
                  options={toolsOptions}
                  value={formData.toolsUsed}
                  onChange={(e, val) =>
                    setFormData((prev) => ({ ...prev, toolsUsed: val }))
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Tools Used" />
                  )}
                />
                <TextField
                  label="Target Application / Components"
                  fullWidth
                  value={formData.targetApplication}
                  onChange={handleChange('targetApplication')}
                />
              </Box>
              {/* Row 10 — full width */}
              <TextField
                label="Comments"
                fullWidth
                multiline
                rows={2}
                value={formData.comments}
                onChange={handleChange('comments')}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5 }}>
            <Button
              onClick={handleClose}
              sx={{ textTransform: 'none', fontWeight: 600, color: '#64748b' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleClose}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                px: 3,
                boxShadow: '0 4px 12px rgba(15, 98, 254, 0.25)',
              }}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </Box>
  )
}

export default BotWarehousePage
