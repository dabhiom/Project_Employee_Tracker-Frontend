import { Card, CardContent, Grid, Stack, Typography } from '@mui/material'

const stats = [
  { label: 'Active Employees', value: '128' },
  { label: 'Running Projects', value: '14' },
  { label: 'Leave Requests', value: '7' },
  { label: 'Pending PO', value: '5' },
]

function DashboardPage() {
  return (
    <div className="dashboard-wrap">
      <div className="dashboard-orb dashboard-orb-left" />
      <div className="dashboard-orb dashboard-orb-right" />

      <div className="dashboard-hero mb-3">
        <Typography variant="h4" className="page-title">
          Dashboard
        </Typography>
        <Typography variant="body1" className="page-subtitle">
          Welcome to your employee tracker overview.
        </Typography>
      </div>

      <Grid container spacing={2.2} sx={{ mt: 0.2 }}>
        {stats.map((item, index) => (
          <Grid key={item.label} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card className="metric-card metric-card-animated" elevation={0} style={{ animationDelay: `${index * 120}ms` }}>
              <CardContent>
                <Stack spacing={0.7}>
                  <Typography variant="body2" className="metric-label">
                    {item.label}
                  </Typography>
                  <Typography variant="h4" className="metric-value">
                    {item.value}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.2} sx={{ mt: 0.8 }}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card className="metric-card metric-card-animated" elevation={0} style={{ animationDelay: '460ms' }}>
            <CardContent>
              <Typography variant="h6" className="metric-value">Project Velocity</Typography>
              <Typography variant="body2" className="page-subtitle">Live progress for key teams</Typography>

              <div className="velocity-item mt-3">
                <span>Frontend Sprint</span>
                <div className="velocity-track">
                  <div className="velocity-fill velocity-fill-one" />
                </div>
              </div>

              <div className="velocity-item mt-3">
                <span>Backend API</span>
                <div className="velocity-track">
                  <div className="velocity-fill velocity-fill-two" />
                </div>
              </div>

              <div className="velocity-item mt-3">
                <span>QA & UAT</span>
                <div className="velocity-track">
                  <div className="velocity-fill velocity-fill-three" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Card className="metric-card metric-card-animated" elevation={0} style={{ animationDelay: '560ms' }}>
            <CardContent>
              <Typography variant="h6" className="metric-value">Today Activity</Typography>
              <ul className="activity-list">
                <li>8 new employee records updated</li>
                <li>3 leave requests awaiting approval</li>
                <li>2 project milestones completed</li>
              </ul>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

export default DashboardPage
