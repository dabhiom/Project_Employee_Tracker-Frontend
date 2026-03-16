import {
  Box,
  Typography,
  Grid,
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
} from '@mui/material'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import BarChartIcon from '@mui/icons-material/BarChart'
import PieChartIcon from '@mui/icons-material/PieChart'
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
    title: 'Total Purchase Orders',
    value: 25,
    description: 'All POs raised to date',
    icon: <ReceiptLongIcon sx={{ fontSize: 36, color: '#3b82f6' }} />,
    accent: '#3b82f6',
    bg: 'rgba(59,130,246,0.07)',
  },
  {
    title: 'Active Purchase Orders',
    value: 18,
    description: 'Currently in-progress POs',
    icon: <CheckCircleOutlineIcon sx={{ fontSize: 36, color: '#22c55e' }} />,
    accent: '#22c55e',
    bg: 'rgba(34,197,94,0.07)',
  },
  {
    title: 'Expired Purchase Orders',
    value: 5,
    description: 'POs past end date',
    icon: <ErrorOutlineIcon sx={{ fontSize: 36, color: '#ef4444' }} />,
    accent: '#ef4444',
    bg: 'rgba(239,68,68,0.07)',
  },
  {
    title: 'Pending Billing',
    value: 7,
    description: 'Awaiting invoice or payment',
    icon: <HourglassEmptyIcon sx={{ fontSize: 36, color: '#f59e0b' }} />,
    accent: '#f59e0b',
    bg: 'rgba(245,158,11,0.07)',
  },
]

// ─── Mock PO Table Data ───────────────────────────────────────────────────────
const poRows = [
  {
    poNumber: 'PO-2024-001',
    clientName: 'Infosys Ltd.',
    projectName: 'ERP Migration',
    poAmount: '₹12,50,000',
    startDate: '01 Jan 2024',
    endDate: '30 Jun 2024',
    status: 'Active',
  },
  {
    poNumber: 'PO-2024-002',
    clientName: 'Tata Consultancy',
    projectName: 'Cloud Infrastructure',
    poAmount: '₹8,75,000',
    startDate: '15 Feb 2024',
    endDate: '14 Aug 2024',
    status: 'Active',
  },
  {
    poNumber: 'PO-2023-018',
    clientName: 'Wipro Technologies',
    projectName: 'Legacy System Upgrade',
    poAmount: '₹5,20,000',
    startDate: '01 Apr 2023',
    endDate: '31 Dec 2023',
    status: 'Expired',
  },
  {
    poNumber: 'PO-2024-005',
    clientName: 'HCL Technologies',
    projectName: 'Mobile App Dev',
    poAmount: '₹3,90,000',
    startDate: '10 Mar 2024',
    endDate: '09 Sep 2024',
    status: 'Pending',
  },
  {
    poNumber: 'PO-2024-007',
    clientName: 'Tech Mahindra',
    projectName: 'Data Analytics Platform',
    poAmount: '₹18,00,000',
    startDate: '01 Apr 2024',
    endDate: '31 Mar 2025',
    status: 'Active',
  },
  {
    poNumber: 'PO-2023-012',
    clientName: 'Cognizant India',
    projectName: 'HR Portal Integration',
    poAmount: '₹4,60,000',
    startDate: '01 Jun 2023',
    endDate: '30 Nov 2023',
    status: 'Expired',
  },
  {
    poNumber: 'PO-2024-009',
    clientName: 'L&T Infotech',
    projectName: 'Finance Automation',
    poAmount: '₹7,15,000',
    startDate: '15 Apr 2024',
    endDate: '14 Oct 2024',
    status: 'Pending',
  },
]

// ─── Status Chip ──────────────────────────────────────────────────────────────
const statusColor = {
  Active: 'success',
  Expired: 'error',
  Pending: 'warning',
}

// ─── Chart Data ───────────────────────────────────────────────────────────────
const poDistributionData = [
  { name: 'Infosys', value: 1250000 },
  { name: 'TCS', value: 875000 },
  { name: 'Wipro', value: 520000 },
  { name: 'HCL', value: 390000 },
  { name: 'Tech Mahindra', value: 1800000 },
]

const revenueData = [
  { client: 'Infosys', revenue: 1250000 },
  { client: 'TCS', revenue: 875000 },
  { client: 'Wipro', revenue: 520000 },
  { client: 'HCL', revenue: 390000 },
  { client: 'Tech Mahindra', revenue: 1800000 },
]

const PIE_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6']
function FinancePage() {
  return (
    <Box sx={{ backgroundColor: '#f4f6f9', minHeight: '100vh', pb: 6 }}>
      <Box sx={{ pt: 4, px: { xs: 2, sm: 3, md: 4 } }}>

        {/* ── Page Header ── */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ color: '#0f172a', letterSpacing: '-0.5px' }}
          >
            Finance Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', mt: 0.5 }}>
            Track purchase orders, billing status, and financial insights.
          </Typography>
          <Divider sx={{ mt: 2.5, borderColor: '#e2e8f0' }} />
        </Box>

        {/* ── KPI Summary Cards ── */}
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
                transition: '0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
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
                  sx={{ color: '#0f172a', lineHeight: 1, mb: 0.6, fontSize: { xs: '1.8rem', lg: '2.5rem' } }}
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

        {/* ── Financial Insights ── */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'nowrap' }}>
          {/* PO Amount Distribution */}
          <Card
            elevation={0}
            sx={{
              flex: '1 1 0',
              minWidth: 0,
              borderRadius: 3,
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
            }}
          >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <PieChartIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
                  <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#0f172a' }}>
                    PO Amount Distribution
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3, borderColor: '#f1f5f9' }} />
                <Box sx={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={poDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={95}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {poDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value) => `₹${(value / 100000).toFixed(2)}L`}
                      />
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

          {/* Revenue by Client */}
          <Card
            elevation={0}
            sx={{
              flex: '1 1 0',
              minWidth: 0,
              borderRadius: 3,
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
            }}
          >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <BarChartIcon sx={{ color: '#22c55e', fontSize: 20 }} />
                  <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#0f172a' }}>
                    Revenue by Client
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3, borderColor: '#f1f5f9' }} />
                <Box sx={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData} margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis
                        dataKey="client"
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tickFormatter={(v) => `₹${v / 100000}L`}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                        width={52}
                      />
                      <RechartsTooltip
                        formatter={(value) => [`₹${(value / 100000).toFixed(2)}L`, 'Revenue']}
                        cursor={{ fill: 'rgba(34,197,94,0.06)' }}
                      />
                      <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={48} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
          </Card>
        </Box>

        {/* ── Purchase Order Table ── */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#0f172a' }}>
                Purchase Orders
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Complete list of all purchase orders with current status
              </Typography>
            </Box>
            <Divider sx={{ mb: 2, borderColor: '#f1f5f9' }} />

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid #f1f5f9' }}>
              <Table sx={{ minWidth: 750 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                    {['PO Number', 'Client Name', 'Project Name', 'PO Amount', 'Start Date', 'End Date', 'Status'].map(
                      (heading) => (
                        <TableCell
                          key={heading}
                          sx={{
                            fontWeight: 700,
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
                      )
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {poRows.map((row, index) => (
                    <TableRow
                      key={row.poNumber}
                      sx={{
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafbfc',
                        '&:hover': { backgroundColor: '#f0f7ff' },
                        '&:last-child td': { borderBottom: 0 },
                        transition: 'background-color 0.15s',
                      }}
                    >
                      <TableCell
                        sx={{ fontWeight: 600, color: '#1e40af', fontSize: '0.85rem', py: 1.8 }}
                      >
                        {row.poNumber}
                      </TableCell>
                      <TableCell sx={{ color: '#0f172a', fontSize: '0.85rem', py: 1.8 }}>
                        {row.clientName}
                      </TableCell>
                      <TableCell sx={{ color: '#334155', fontSize: '0.85rem', py: 1.8 }}>
                        {row.projectName}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.85rem', py: 1.8 }}>
                        {row.poAmount}
                      </TableCell>
                      <TableCell sx={{ color: '#64748b', fontSize: '0.85rem', py: 1.8 }}>
                        {row.startDate}
                      </TableCell>
                      <TableCell sx={{ color: '#64748b', fontSize: '0.85rem', py: 1.8 }}>
                        {row.endDate}
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
                            minWidth: 76,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

      </Box>
    </Box>
  )
}

export default FinancePage