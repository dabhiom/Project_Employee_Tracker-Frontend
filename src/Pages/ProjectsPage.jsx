import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Add,
  Search,
  Visibility,
  Edit,
  FilterList,
  CalendarToday,
  Person,
  Business,
} from "@mui/icons-material";
import ProjectFormModal from "../Components/ProjectFormModal";
import ProjectDetailsModal from "../Components/ProjectDetailsModal";

/* ── Seed data (remove once backend is wired) ───────────────────────────── */
const SEED = [
  {
    _id: "1",
    projectName: "EMS Portal",
    clientId: "Tecnoprism",
    projectType: "Fixed",
    projectStatus: "Active",
    projectStartDate: "2024-01-15",
    projectEndDate: "2024-12-31",
    projectManagerId: "Rahul Sharma",
    teamLeadId: "Priya Mehta",
    projectDescription: "Full employee management system with leave, billing and allocation modules.",
    clientAssetRequired: true,
    projectComment: "Client wants weekly updates.",
    status: true,
    createdAt: "2024-01-10",
  },
  {
    _id: "2",
    projectName: "HR Automation Bot",
    clientId: "Infosys",
    projectType: "BOT",
    projectStatus: "Hold",
    projectStartDate: "2024-03-01",
    projectEndDate: "2024-09-30",
    projectManagerId: "Ankit Joshi",
    teamLeadId: "Sneha Patel",
    projectDescription: "Automation bot for HR processes including payroll and attendance.",
    clientAssetRequired: false,
    projectComment: "On hold due to budget approval.",
    status: true,
    createdAt: "2024-02-20",
  },
  {
    _id: "3",
    projectName: "IT Support Desk",
    clientId: "TCS",
    projectType: "Support",
    projectStatus: "Closed",
    projectStartDate: "2023-06-01",
    projectEndDate: "2024-01-31",
    projectManagerId: "Deepak Nair",
    teamLeadId: "Kavya Rao",
    projectDescription: "L1/L2 IT support desk operations.",
    clientAssetRequired: true,
    projectComment: "Project successfully delivered.",
    status: false,
    createdAt: "2023-05-25",
  },
];

const STATUS_COLORS = { Active: "success", Hold: "warning", Closed: "error" };
const TYPE_COLORS   = { Fixed: "primary",  BOT: "secondary", Support: "info" };

/* ── Small info row used inside mobile card ─────────────────────────────── */
const InfoRow = ({ icon: Icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <Icon sx={{ fontSize: 14, color: "#90a4ae" }} />
    <Typography variant="caption" color="text.secondary">{label}:</Typography>
    <Typography variant="caption" fontWeight={600} color="#1a1a2e">{value || "—"}</Typography>
  </Box>
);

/* ════════════════════════════════════════════════════════════════════════ */
export default function ProjectsPage() {
  const theme   = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // < 900px → cards

  const [projects,     setProjects]     = useState(SEED);
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [formOpen,     setFormOpen]     = useState(false);
  const [editData,     setEditData]     = useState(null);
  const [detailOpen,   setDetailOpen]   = useState(false);
  const [detailData,   setDetailData]   = useState(null);

  /* ── Filtered list ────────────────────────────────────────────────────── */
  const filtered = projects.filter((p) => {
    const matchSearch =
      p.projectName.toLowerCase().includes(search.toLowerCase()) ||
      p.clientId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || p.projectStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  /* ── Handlers ─────────────────────────────────────────────────────────── */
  const handleAdd  = ()    => { setEditData(null); setFormOpen(true); };
  const handleEdit = (row) => { setEditData(row);  setFormOpen(true); };
  const handleView = (row) => { setDetailData(row); setDetailOpen(true); };

  const handleSave = (formData) => {
    if (editData) {
      setProjects((prev) =>
        prev.map((p) => (p._id === editData._id ? { ...formData, _id: editData._id } : p))
      );
    } else {
      setProjects((prev) => [
        ...prev,
        {
          ...formData,
          _id: Date.now().toString(),
          createdAt: new Date().toISOString().split("T")[0],
        },
      ]);
    }
    setFormOpen(false);
  };

  /* ── Stats ────────────────────────────────────────────────────────────── */
  const stats = [
    { label: "Total",  value: projects.length,                                              color: "#1a3c6e" },
    { label: "Active", value: projects.filter((p) => p.projectStatus === "Active").length,  color: "#2e7d32" },
    { label: "On Hold",value: projects.filter((p) => p.projectStatus === "Hold").length,    color: "#e65100" },
    { label: "Closed", value: projects.filter((p) => p.projectStatus === "Closed").length,  color: "#b71c1c" },
  ];

  /* ════════════════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════════════════ */
  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        bgcolor: "#f0f4f8",
        minHeight: "100vh",
      }}
    >
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "row", sm: "row" },
          mb: 3,
          gap: 1,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={700}
            color="#1a3c6e"
            fontSize={{ xs: "1.1rem", sm: "1.4rem" }}
          >
            Projects
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Manage all your projects, assignments and timelines.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
          size={isMobile ? "small" : "medium"}
          sx={{
            bgcolor: "#1a3c6e",
            "&:hover": { bgcolor: "#15305a" },
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            px: { xs: 2, sm: 3 },
            whiteSpace: "nowrap",
          }}
        >
          {isMobile ? "New" : "Create Project"}
        </Button>
      </Box>

      {/* ── Stats Cards ─────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",   /* 2 cols on mobile */
            sm: "repeat(4, 1fr)",   /* 4 cols on tablet+ */
          },
          gap: 2,
          mb: 3,
        }}
      >
        {stats.map((s) => (
          <Paper
            key={s.label}
            elevation={0}
            sx={{
              p: { xs: 2, sm: 2.5 },
              borderRadius: 3,
              border: "1px solid #e0e7ef",
              bgcolor: "#fff",
            }}
          >
            <Typography
              fontWeight={700}
              color={s.color}
              fontSize={{ xs: "1.6rem", sm: "2rem" }}
              lineHeight={1}
            >
              {s.value}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {s.label}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* ── Filter Row ──────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          mb: 2,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
        }}
      >
        <TextField
          placeholder="Search project or client…"
          size="small"
          fullWidth={isMobile}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ bgcolor: "#fff", borderRadius: 2, minWidth: { sm: 260 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" sx={{ color: "#90a4ae" }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select
          size="small"
          fullWidth={isMobile}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ bgcolor: "#fff", borderRadius: 2, minWidth: { sm: 150 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterList fontSize="small" sx={{ color: "#90a4ae" }} />
              </InputAdornment>
            ),
          }}
        >
          {["All", "Active", "Hold", "Closed"].map((s) => (
            <MenuItem key={s} value={s}>{s}</MenuItem>
          ))}
        </TextField>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ ml: { sm: "auto" }, whiteSpace: "nowrap" }}
        >
          <strong>{filtered.length}</strong> of {projects.length} projects
        </Typography>
      </Box>

      {/* ════════════════════════════════════════════════════════════════════
          MOBILE VIEW — Cards
      ════════════════════════════════════════════════════════════════════ */}
      {isMobile && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filtered.length === 0 ? (
            <Paper
              elevation={0}
              sx={{ p: 4, textAlign: "center", borderRadius: 3, border: "1px solid #e0e7ef" }}
            >
              <Typography color="text.secondary">No projects found.</Typography>
            </Paper>
          ) : (
            filtered.map((row) => (
              <Paper
                key={row._id}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: "1px solid #e0e7ef",
                  bgcolor: "#fff",
                  overflow: "hidden",
                }}
              >
                {/* Card Header */}
                <Box
                  sx={{
                    bgcolor: "#1a3c6e",
                    px: 2,
                    py: 1.5,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography fontWeight={700} color="#fff" fontSize="0.9rem">
                    {row.projectName}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Chip
                      label={row.projectStatus}
                      color={STATUS_COLORS[row.projectStatus] || "default"}
                      size="small"
                      sx={{ fontSize: "0.68rem", fontWeight: 700, height: 22 }}
                    />
                  </Box>
                </Box>

                {/* Card Body */}
                <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Chip
                      label={row.projectType}
                      color={TYPE_COLORS[row.projectType] || "default"}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: "0.68rem", fontWeight: 600, height: 22 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      #{row._id}
                    </Typography>
                  </Box>

                  <Divider sx={{ borderColor: "#f0f4f8" }} />

                  <InfoRow icon={Business} label="Client"   value={row.clientId} />
                  <InfoRow icon={Person}   label="Manager"  value={row.projectManagerId} />
                  <InfoRow icon={Person}   label="Lead"     value={row.teamLeadId} />
                  <InfoRow icon={CalendarToday} label="Start" value={row.projectStartDate} />
                  <InfoRow icon={CalendarToday} label="End"   value={row.projectEndDate} />
                </Box>

                {/* Card Footer — Actions */}
                <Divider sx={{ borderColor: "#f0f4f8" }} />
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    display: "flex",
                    gap: 1,
                    justifyContent: "flex-end",
                    bgcolor: "#fafbfc",
                  }}
                >
                  <Button
                    size="small"
                    startIcon={<Visibility sx={{ fontSize: "14px !important" }} />}
                    onClick={() => handleView(row)}
                    sx={{
                      textTransform: "none",
                      color: "#1a3c6e",
                      fontSize: "0.75rem",
                      borderRadius: 2,
                      "&:hover": { bgcolor: "#e8eef7" },
                    }}
                  >
                    View
                  </Button>
                  <Button
                    size="small"
                    startIcon={<Edit sx={{ fontSize: "14px !important" }} />}
                    onClick={() => handleEdit(row)}
                    sx={{
                      textTransform: "none",
                      color: "#2196f3",
                      fontSize: "0.75rem",
                      borderRadius: 2,
                      "&:hover": { bgcolor: "#e3f2fd" },
                    }}
                  >
                    Edit
                  </Button>
                </Box>
              </Paper>
            ))
          )}
        </Box>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          DESKTOP VIEW — Table
      ════════════════════════════════════════════════════════════════════ */}
      {!isMobile && (
        <Paper
          elevation={0}
          sx={{ borderRadius: 3, border: "1px solid #e0e7ef", overflow: "hidden" }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#1a3c6e" }}>
                  {["#", "Project Name", "Client", "Type", "Manager", "Team Lead", "Start Date", "End Date", "Status", "Actions"].map(
                    (h) => (
                      <TableCell
                        key={h}
                        sx={{
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: "0.78rem",
                          whiteSpace: "nowrap",
                          py: 1.5,
                        }}
                      >
                        {h}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ py: 6, color: "text.secondary" }}>
                      No projects found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((row, idx) => (
                    <TableRow
                      key={row._id}
                      hover
                      sx={{
                        "&:hover": { bgcolor: "#f0f7ff" },
                        bgcolor: idx % 2 === 0 ? "#fff" : "#fafbfc",
                      }}
                    >
                      <TableCell sx={{ fontSize: "0.82rem", color: "#888", py: 1.5 }}>{idx + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#1a3c6e", py: 1.5 }}>
                        {row.projectName}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.85rem", py: 1.5 }}>{row.clientId}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Chip
                          label={row.projectType}
                          color={TYPE_COLORS[row.projectType] || "default"}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 600, fontSize: "0.72rem" }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.85rem", py: 1.5 }}>{row.projectManagerId}</TableCell>
                      <TableCell sx={{ fontSize: "0.85rem", py: 1.5 }}>{row.teamLeadId}</TableCell>
                      <TableCell sx={{ fontSize: "0.82rem", py: 1.5 }}>{row.projectStartDate}</TableCell>
                      <TableCell sx={{ fontSize: "0.82rem", py: 1.5 }}>{row.projectEndDate}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Chip
                          label={row.projectStatus}
                          color={STATUS_COLORS[row.projectStatus] || "default"}
                          size="small"
                          sx={{ fontWeight: 600, fontSize: "0.72rem" }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleView(row)}
                              sx={{ color: "#1a3c6e" }}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Project">
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(row)}
                              sx={{ color: "#2196f3" }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* ── Modals ──────────────────────────────────────────────────────── */}
      <ProjectFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        editData={editData}
      />
      <ProjectDetailsModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        data={detailData}
        onEdit={(row) => {
          setDetailOpen(false);
          handleEdit(row);
        }}
      />
    </Box>
  );
}
