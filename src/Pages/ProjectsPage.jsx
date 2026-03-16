// src/Pages/ProjectsPage.jsx
import { useEffect, useState } from "react";
import {
  Box, Button, Chip, CircularProgress, Divider, IconButton,
  InputAdornment, MenuItem, Paper, Snackbar, Alert, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Tooltip, Typography, useMediaQuery, useTheme,
} from "@mui/material";
import {
  Add, Search, Visibility, Edit, Delete,
  FilterList, CalendarToday, Person, Business,
} from "@mui/icons-material";
import ProjectFormModal    from "../Components/ProjectFormModal";
import ProjectDetailsModal from "../Components/ProjectDetailsModal";
import {
  getAllProjects, getProjectById,
  createProject, updateProject, deleteProject,
} from "../api/projectApi";

const STATUS_COLORS = { Active: "success", Hold: "warning", Closed: "error" };
const TYPE_COLORS   = { Fixed: "primary",  BOT: "secondary", Support: "info" };

/* ── Date formatter: turns any ISO/mongo date → "15 Jan 2024" ───────────── */
const fmtDate = (val) => {
  if (!val) return "N/A";
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return val;
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return val;
  }
};

const getClientName = (c) => typeof c === 'object' && c !== null ? (c.customerName || c.clientName || c.name || c.companyName || c._id) : (c || "");
const getEmpName = (e) => typeof e === 'object' && e !== null ? (e.fullName || e.name || `${e.firstName||""} ${e.lastName||""}`.trim() || e.email || e._id) : (e || "");

const InfoRow = ({ icon: Icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <Icon sx={{ fontSize: 14, color: "#90a4ae" }} />
    <Typography variant="caption" color="text.secondary">{label}:</Typography>
    <Typography variant="caption" fontWeight={600} color="#1a1a2e">{value || "—"}</Typography>
  </Box>
);

export default function ProjectsPage() {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [projects,     setProjects]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [formOpen,     setFormOpen]     = useState(false);
  const [editData,     setEditData]     = useState(null);
  const [detailOpen,   setDetailOpen]   = useState(false);
  const [detailData,   setDetailData]   = useState(null);
  const [snack,        setSnack]        = useState({ open: false, msg: "", severity: "success" });

  const showSnack = (msg, severity = "success") =>
    setSnack({ open: true, msg, severity });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res  = await getAllProjects();
      const list =
        Array.isArray(res.data)           ? res.data :
        Array.isArray(res.data?.data)     ? res.data.data :
        Array.isArray(res.data?.projects) ? res.data.projects :
        [];
      setProjects(list);
    } catch (err) {
      const status = err?.response?.status;
      showSnack(
        status === 401 ? "Session expired — please log in again." : "Could not load projects.",
        "warning"
      );
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleView = async (row) => {
    try {
      const res = await getProjectById(row._id);
      setDetailData(res.data?.data ?? res.data);
    } catch {
      setDetailData(row);
    }
    setDetailOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      if (editData) {
        const res = await updateProject(editData._id, formData);
        const updated = res.data?.data ?? res.data;
        setProjects((prev) => prev.map((p) => (p._id === editData._id ? updated : p)));
        showSnack("Project updated successfully!");
      } else {
        const res = await createProject(formData);
        const created = res.data?.data ?? res.data;
        setProjects((prev) => [...prev, created]);
        showSnack("Project created successfully!");
      }
      setFormOpen(false);
    } catch (err) {
      showSnack(err?.response?.data?.message || "Failed to save project.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      if (detailData?._id === id) { setDetailOpen(false); setDetailData(null); }
      showSnack("Project deleted.");
    } catch (err) {
      showSnack(err?.response?.data?.message || "Failed to delete project.", "error");
    }
  };

  const handleAdd  = ()    => { setEditData(null); setFormOpen(true); };
  const handleEdit = (row) => { setEditData(row);  setFormOpen(true); };

  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch =
      (p.projectName || "").toLowerCase().includes(q) ||
      getClientName(p.clientId).toLowerCase().includes(q) ||
      getEmpName(p.projectManagerId).toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || p.projectStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = [
    { label: "Total",   value: projects.length,                                             color: "#1a3c6e" },
    { label: "Active",  value: projects.filter((p) => p.projectStatus === "Active").length, color: "#2e7d32" },
    { label: "On Hold", value: projects.filter((p) => p.projectStatus === "Hold").length,   color: "#e65100" },
    { label: "Closed",  value: projects.filter((p) => p.projectStatus === "Closed").length, color: "#b71c1c" },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: "#f0f4f8", minHeight: "100vh" }}>

      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, gap: 1 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="#1a3c6e" fontSize={{ xs: "1.1rem", sm: "1.4rem" }}>
            Projects
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: { xs: "none", sm: "block" } }}>
            Manage all your projects, assignments and timelines.
          </Typography>
        </Box>
        <Button
          variant="contained" startIcon={<Add />} onClick={handleAdd}
          size={isMobile ? "small" : "medium"}
          sx={{ bgcolor: "#1a3c6e", "&:hover": { bgcolor: "#15305a" }, borderRadius: 2, textTransform: "none", fontWeight: 600, px: { xs: 2, sm: 3 }, whiteSpace: "nowrap" }}
        >
          {isMobile ? "New" : "Create Project"}
        </Button>
      </Box>

      {/* Stats */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2,1fr)", sm: "repeat(4,1fr)" }, gap: 2, mb: 3 }}>
        {stats.map((s) => (
          <Paper key={s.label} elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 3, border: "1px solid #e0e7ef", bgcolor: "#fff" }}>
            <Typography fontWeight={700} color={s.color} fontSize={{ xs: "1.6rem", sm: "2rem" }} lineHeight={1}>
              {loading ? "…" : s.value}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>{s.label}</Typography>
          </Paper>
        ))}
      </Box>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 1.5, mb: 2, flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "stretch", sm: "center" } }}>
        <TextField
          placeholder="Search project or client…" size="small" fullWidth={isMobile}
          value={search} onChange={(e) => setSearch(e.target.value)}
          sx={{ bgcolor: "#fff", borderRadius: 2, minWidth: { sm: 260 } }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" sx={{ color: "#90a4ae" }} /></InputAdornment> }}
        />
        <TextField
          select size="small" fullWidth={isMobile} value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ bgcolor: "#fff", borderRadius: 2, minWidth: { sm: 150 } }}
          InputProps={{ startAdornment: <InputAdornment position="start"><FilterList fontSize="small" sx={{ color: "#90a4ae" }} /></InputAdornment> }}
        >
          {["All","Active","Hold","Closed"].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>
        <Typography variant="body2" color="text.secondary" sx={{ ml: { sm: "auto" }, whiteSpace: "nowrap" }}>
          <strong>{filtered.length}</strong> of {projects.length} projects
        </Typography>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: "#1a3c6e" }} />
        </Box>
      )}

      {/* Mobile Cards */}
      {!loading && isMobile && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filtered.length === 0 ? (
            <Paper elevation={0} sx={{ p: 4, textAlign: "center", borderRadius: 3, border: "1px solid #e0e7ef" }}>
              <Typography color="text.secondary">No projects found.</Typography>
            </Paper>
          ) : filtered.map((row) => (
            <Paper key={row._id} elevation={0} sx={{ borderRadius: 3, border: "1px solid #e0e7ef", bgcolor: "#fff", overflow: "hidden" }}>
              <Box sx={{ bgcolor: "#1a3c6e", px: 2, py: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography fontWeight={700} color="#fff" fontSize="0.9rem">{row.projectName}</Typography>
                <Chip label={row.projectStatus} color={STATUS_COLORS[row.projectStatus] || "default"} size="small" sx={{ fontSize: "0.68rem", fontWeight: 700, height: 22 }} />
              </Box>
              <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Chip label={row.projectType} color={TYPE_COLORS[row.projectType] || "default"} size="small" variant="outlined" sx={{ fontSize: "0.68rem", fontWeight: 600, height: 22 }} />
                  <Typography variant="caption" color="text.secondary">#{row._id}</Typography>
                </Box>
                <Divider sx={{ borderColor: "#f0f4f8" }} />
                <InfoRow icon={Business}      label="Client"  value={getClientName(row.clientId)} />
                <InfoRow icon={Person}        label="Manager" value={getEmpName(row.projectManagerId)} />
                <InfoRow icon={Person}        label="Lead"    value={getEmpName(row.teamLeadId)} />
                <InfoRow icon={CalendarToday} label="Start"   value={fmtDate(row.projectStartDate)} />
                <InfoRow icon={CalendarToday} label="End"     value={fmtDate(row.projectEndDate)} />
              </Box>
              <Divider sx={{ borderColor: "#f0f4f8" }} />
              <Box sx={{ px: 2, py: 1, display: "flex", gap: 1, justifyContent: "flex-end", bgcolor: "#fafbfc" }}>
                <Button size="small" startIcon={<Visibility sx={{ fontSize: "14px !important" }} />} onClick={() => handleView(row)}
                  sx={{ textTransform: "none", color: "#1a3c6e", fontSize: "0.75rem", borderRadius: 2, "&:hover": { bgcolor: "#e8eef7" } }}>View</Button>
                <Button size="small" startIcon={<Edit sx={{ fontSize: "14px !important" }} />} onClick={() => handleEdit(row)}
                  sx={{ textTransform: "none", color: "#2196f3", fontSize: "0.75rem", borderRadius: 2, "&:hover": { bgcolor: "#e3f2fd" } }}>Edit</Button>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {/* Desktop Table */}
      {!loading && !isMobile && (
        <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #e0e7ef", overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#1a3c6e" }}>
                  {["#","Project Name","Client","Type","Manager","Team Lead","Start Date","End Date","Status","Actions"].map((h) => (
                    <TableCell key={h} sx={{ color: "#fff", fontWeight: 600, fontSize: "0.78rem", whiteSpace: "nowrap", py: 1.5 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ py: 6, color: "text.secondary" }}>No projects found.</TableCell>
                  </TableRow>
                ) : filtered.map((row, idx) => (
                  <TableRow key={row._id} hover sx={{ "&:hover": { bgcolor: "#f0f7ff" }, bgcolor: idx % 2 === 0 ? "#fff" : "#fafbfc" }}>
                    <TableCell sx={{ fontSize: "0.82rem", color: "#888", py: 1.5 }}>{idx + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#1a3c6e", py: 1.5 }}>{row.projectName}</TableCell>
                    <TableCell sx={{ fontSize: "0.85rem", py: 1.5 }}>{getClientName(row.clientId) || "N/A"}</TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Chip label={row.projectType || "N/A"} color={TYPE_COLORS[row.projectType] || "default"} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: "0.72rem" }} />
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.85rem", py: 1.5 }}>{getEmpName(row.projectManagerId) || "N/A"}</TableCell>
                    <TableCell sx={{ fontSize: "0.85rem", py: 1.5 }}>{getEmpName(row.teamLeadId) || "N/A"}</TableCell>
                    {/* ── Formatted dates ── */}
                    <TableCell sx={{ fontSize: "0.82rem", py: 1.5 }}>{fmtDate(row.projectStartDate)}</TableCell>
                    <TableCell sx={{ fontSize: "0.82rem", py: 1.5 }}>{fmtDate(row.projectEndDate)}</TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Chip label={row.projectStatus || "N/A"} color={STATUS_COLORS[row.projectStatus] || "default"} size="small" sx={{ fontWeight: 600, fontSize: "0.72rem" }} />
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => handleView(row)} sx={{ color: "#1a3c6e" }}><Visibility fontSize="small" /></IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Project">
                          <IconButton size="small" onClick={() => handleEdit(row)} sx={{ color: "#2196f3" }}><Edit fontSize="small" /></IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Project">
                          <IconButton size="small" onClick={() => handleDelete(row._id)} sx={{ color: "#d32f2f" }}><Delete fontSize="small" /></IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

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
        onEdit={(row) => { setDetailOpen(false); handleEdit(row); }}
        onDelete={(id) => { setDetailOpen(false); handleDelete(id); }}
      />

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={snack.severity} variant="filled" sx={{ borderRadius: 2, fontWeight: 600 }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}