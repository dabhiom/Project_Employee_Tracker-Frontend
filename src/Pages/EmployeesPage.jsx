import { useState, useEffect } from "react";
import {
  Box, Button, Chip, Divider,
  IconButton, InputAdornment, MenuItem, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField,
  Tooltip, Typography, useMediaQuery, useTheme,
} from "@mui/material";
import {
  Add, Search, Visibility, Edit, Delete, FilterList,
  Email, Phone, Person, Business,
  PeopleAlt, CheckCircle, NotificationsActive,
} from "@mui/icons-material";
import EmployeeFormModal from "../Components/EmployeeFormModal";
import MasterDetailsModal from "../Components/MasterDetailsModal";
import MasterDeleteDialog from "../Components/MasterDeleteDialog";
import { useToast } from "../Components/ToastProvider";

const STORAGE_KEY = "employees_data";
const STATUS_COLORS = { Active: "success", Notice: "warning", Exited: "error" };
const DESIGNATION_OPTIONS = ["Developer","Manager","Analyst","Designer","Team Lead","Senior Developer"];

/* ── Avatar initials box ────────────────────────────────────────────────── */
const AvatarBox = ({ firstName, lastName, size = 34, fontSize = "0.8rem" }) => {
  const colors = ["#1a3c6e","#0f766e","#7c3aed","#be185d","#b45309","#0369a1"];
  const idx    = ((firstName?.[0] || "").charCodeAt(0) + (lastName?.[0] || "").charCodeAt(0)) % colors.length;
  return (
    <Box sx={{
      width: size, height: size, borderRadius: 1.5, flexShrink: 0,
      bgcolor: colors[idx], display: "flex", alignItems: "center",
      justifyContent: "center", fontWeight: 700, fontSize, color: "#fff",
    }}>
      {(firstName?.[0] || "").toUpperCase()}{(lastName?.[0] || "").toUpperCase()}
    </Box>
  );
};

/* ── Mobile card info row ───────────────────────────────────────────────── */
const InfoRow = ({ icon: Icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <Icon sx={{ fontSize: 13, color: "#8faabf" }} />
    <Typography variant="caption" color="text.secondary" sx={{ minWidth: 58 }}>{label}</Typography>
    <Typography variant="caption" fontWeight={600} color="#1a2740" noWrap>{value || "—"}</Typography>
  </Box>
);

/* ════════════════════════════════════════════════════════════════════════ */
export default function EmployeesPage() {
  const theme   = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { showToast } = useToast();

  /* ── State ──────────────────────────────────────────────────────────── */
  const [employees, setEmployees] = useState(() => {
    try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : []; }
    catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(employees)); } catch {}
  }, [employees]);

  const [search, setSearch]                 = useState("");
  const [statusFilter, setStatusFilter]     = useState("All");
  const [designFilter, setDesignFilter]     = useState("All");
  const [formOpen, setFormOpen]             = useState(false);
  const [editData, setEditData]             = useState(null);
  const [detailOpen, setDetailOpen]         = useState(false);
  const [detailData, setDetailData]         = useState(null);
  const [deleteOpen, setDeleteOpen]         = useState(false);
  const [deleteTarget, setDeleteTarget]     = useState(null);

  /* ── Filtered ───────────────────────────────────────────────────────── */
  const filtered = employees.filter((e) => {
    const name = `${e.firstName} ${e.lastName}`.toLowerCase();
    return (
      (name.includes(search.toLowerCase()) || e.employeeId.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === "All" || e.employeeStatus === statusFilter) &&
      (designFilter  === "All" || e.designation    === designFilter)
    );
  });

  /* ── Handlers ───────────────────────────────────────────────────────── */
  const handleAdd    = ()    => { setEditData(null); setFormOpen(true); };
  const handleEdit   = (row) => { setEditData(row);  setFormOpen(true); };
  const handleView   = (row) => { setDetailData(row); setDetailOpen(true); };
  const handleDelete = (row) => { setDeleteTarget(row); setDeleteOpen(true); };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setEmployees((p) => p.filter((e) => e._id !== deleteTarget._id));
    setDeleteOpen(false); setDeleteTarget(null);
    showToast("Employee deleted successfully", "success");
  };

  const handleSave = (formData) => {
    if (editData) {
      setEmployees((p) => p.map((e) => e._id === editData._id ? { ...formData, _id: editData._id } : e));
      showToast("Employee updated successfully", "success");
    } else {
      setEmployees((p) => [...p, { ...formData, _id: Date.now().toString(), createdAt: new Date().toISOString().split("T")[0] }]);
      showToast("Employee added successfully", "success");
    }
  };

  /* ── Stats config — solid coloured cards so they always contrast ──── */
  const activeCount  = employees.filter((e) => e.employeeStatus === "Active").length;
  const noticeCount  = employees.filter((e) => e.employeeStatus === "Notice").length;
  const exitedCount  = employees.filter((e) => e.employeeStatus === "Exited").length;

  const stats = [
    {
      label: "Total Employees", value: employees.length,
      icon: PeopleAlt,
      gradient: "linear-gradient(135deg, #1a3c6e 0%, #1e4d8c 100%)",
      accent: "#5baeff",
    },
    {
      label: "Active", value: activeCount,
      icon: CheckCircle,
      gradient: "linear-gradient(135deg, #166534 0%, #15803d 100%)",
      accent: "#86efac",
    },
    {
      label: "On Notice", value: noticeCount,
      icon: NotificationsActive,
      gradient: "linear-gradient(135deg, #92400e 0%, #b45309 100%)",
      accent: "#fcd34d",
    },
  ];

  /* ─────────────────────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────────────────────── */
  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: "#f0f4f8", minHeight: "100vh" }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, gap: 1 }}>
        <Box>
          <Typography variant="h5" fontWeight={800} color="#1a2740"
            fontSize={{ xs: "1.1rem", sm: "1.4rem" }} letterSpacing={-0.3}>
            Employees
          </Typography>
          <Typography variant="body2" color="text.secondary" fontSize="0.8rem"
            sx={{ display: { xs: "none", sm: "block" }, mt: 0.3 }}>
            Manage employee information, roles and details
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}
          size={isMobile ? "small" : "medium"}
          sx={{
            bgcolor: "#1a3c6e", borderRadius: "8px", textTransform: "none",
            fontWeight: 700, px: { xs: 2, sm: 3 }, whiteSpace: "nowrap",
            boxShadow: "0 4px 12px rgba(26,60,110,0.28)",
            "&:hover": { bgcolor: "#15305a", boxShadow: "0 6px 18px rgba(26,60,110,0.35)" },
          }}>
          {isMobile ? "New" : "Add Employee"}
        </Button>
      </Box>

      {/* ── Stat Cards — solid gradient so they pop off any background ── */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: { xs: 1.5, sm: 2 }, mb: 3 }}>
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Box key={s.label} sx={{
              background: s.gradient,
              borderRadius: "12px",
              p: { xs: "14px 16px", sm: "18px 22px" },
              display: "flex", alignItems: "center", gap: { xs: 1.5, sm: 2 },
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              position: "relative", overflow: "hidden",
              transition: "transform 0.18s, box-shadow 0.18s",
              "&:hover": { transform: "translateY(-2px)", boxShadow: "0 8px 24px rgba(0,0,0,0.18)" },
            }}>
              {/* Decorative circle bg */}
              <Box sx={{
                position: "absolute", right: -16, top: -16,
                width: 80, height: 80, borderRadius: "50%",
                bgcolor: "rgba(255,255,255,0.07)",
              }} />
              <Box sx={{
                width: { xs: 38, sm: 46 }, height: { xs: 38, sm: 46 },
                borderRadius: "10px", bgcolor: "rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Icon sx={{ color: "#fff", fontSize: { xs: 20, sm: 24 } }} />
              </Box>
              <Box>
                <Typography fontWeight={800} color="#fff"
                  fontSize={{ xs: "1.6rem", sm: "2rem" }} lineHeight={1}>
                  {s.value}
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: { xs: "0.68rem", sm: "0.78rem" }, mt: 0.3, fontWeight: 500 }}>
                  {s.label}
                </Typography>
              </Box>
              {/* Accent dot */}
              <Box sx={{
                position: "absolute", right: 16, bottom: 14,
                width: 8, height: 8, borderRadius: "50%", bgcolor: s.accent,
                opacity: 0.8,
              }} />
            </Box>
          );
        })}
      </Box>

      {/* ── Filter Bar ──────────────────────────────────────────────────── */}
      <Paper elevation={0} sx={{
        p: { xs: 1.5, sm: "12px 16px" }, mb: 2.5, borderRadius: "10px",
        border: "1px solid #e0eaf5", bgcolor: "#fff",
        display: "flex", gap: 1.5,
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "center" },
      }}>
        <TextField placeholder="Search name or ID…" size="small" fullWidth={isMobile}
          value={search} onChange={(e) => setSearch(e.target.value)}
          sx={{
            minWidth: { sm: 230 },
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px", fontSize: "0.875rem",
              "& fieldset": { borderColor: "#d0dcea" },
              "&:hover fieldset": { borderColor: "#1a3c6e" },
              "&.Mui-focused fieldset": { borderColor: "#1a3c6e" },
            },
          }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" sx={{ color: "#8faabf" }} /></InputAdornment> }} />

        <TextField select size="small" fullWidth={isMobile} value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{
            minWidth: { sm: 135 },
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px", fontSize: "0.875rem",
              "& fieldset": { borderColor: "#d0dcea" },
              "&:hover fieldset": { borderColor: "#1a3c6e" },
              "&.Mui-focused fieldset": { borderColor: "#1a3c6e" },
            },
          }}
          InputProps={{ startAdornment: <InputAdornment position="start"><FilterList fontSize="small" sx={{ color: "#8faabf" }} /></InputAdornment> }}>
          {["All","Active","Notice","Exited"].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>

        <TextField select size="small" fullWidth={isMobile} value={designFilter}
          onChange={(e) => setDesignFilter(e.target.value)}
          sx={{
            minWidth: { sm: 148 },
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px", fontSize: "0.875rem",
              "& fieldset": { borderColor: "#d0dcea" },
              "&:hover fieldset": { borderColor: "#1a3c6e" },
              "&.Mui-focused fieldset": { borderColor: "#1a3c6e" },
            },
          }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Person fontSize="small" sx={{ color: "#8faabf" }} /></InputAdornment> }}>
          {["All", ...DESIGNATION_OPTIONS].map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
        </TextField>

        <Box sx={{ ml: { sm: "auto" }, display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap", fontSize: "0.8rem" }}>
            Showing <strong style={{ color: "#1a3c6e" }}>{filtered.length}</strong> of {employees.length}
          </Typography>
        </Box>
      </Paper>

      {/* ════════════════════════════════════════════════════════════════
          MOBILE CARDS
      ════════════════════════════════════════════════════════════════ */}
      {isMobile && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filtered.length === 0 ? (
            <Paper elevation={0} sx={{
              p: 5, textAlign: "center", borderRadius: "12px",
              border: "1px dashed #c8d8ec", bgcolor: "#fff",
            }}>
              <PeopleAlt sx={{ fontSize: 42, color: "#c8d8ec", mb: 1 }} />
              <Typography color="text.secondary" fontWeight={600}>No employees found</Typography>
              <Typography variant="caption" color="text.disabled">Try adjusting filters or add a new employee</Typography>
            </Paper>
          ) : filtered.map((row) => (
            <Paper key={row._id} elevation={0} sx={{
              borderRadius: "14px", border: "1px solid #e0eaf5",
              bgcolor: "#fff", overflow: "hidden",
              transition: "box-shadow 0.2s",
              "&:hover": { boxShadow: "0 4px 18px rgba(26,60,110,0.1)" },
            }}>
              <Box sx={{
                background: "linear-gradient(135deg, #1a3c6e 0%, #1e4d8c 100%)",
                px: 2, py: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <Box>
                  <Typography fontWeight={700} color="#fff" fontSize="0.92rem">
                    {row.firstName} {row.lastName}
                  </Typography>
                  <Typography fontSize="0.72rem" color="#93c5fd">{row.employeeId}</Typography>
                </Box>
                <Chip label={row.employeeStatus} color={STATUS_COLORS[row.employeeStatus] || "default"}
                  size="small" sx={{ fontSize: "0.65rem", fontWeight: 700, height: 20 }} />
              </Box>
              <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 0.8 }}>
                <InfoRow icon={Business} label="Role"    value={`${row.designation}${row.department ? ` · ${row.department}` : ""}`} />
                <InfoRow icon={Email}    label="Email"   value={row.email} />
                <InfoRow icon={Phone}    label="Phone"   value={row.phone} />
                <InfoRow icon={Person}   label="Manager" value={row.reportingManager} />
              </Box>
              <Box sx={{
                px: 2, py: 1, display: "flex", gap: 1, justifyContent: "flex-end",
                bgcolor: "#f8fafc", borderTop: "1px solid #f0f4f8",
              }}>
                <Button size="small" startIcon={<Visibility sx={{ fontSize: "13px !important" }} />} onClick={() => handleView(row)}
                  sx={{ textTransform: "none", color: "#1a3c6e", fontSize: "0.75rem", borderRadius: "6px", "&:hover": { bgcolor: "#eef3fb" } }}>View</Button>
                <Button size="small" startIcon={<Edit sx={{ fontSize: "13px !important" }} />} onClick={() => handleEdit(row)}
                  sx={{ textTransform: "none", color: "#2563eb", fontSize: "0.75rem", borderRadius: "6px", "&:hover": { bgcolor: "#eff6ff" } }}>Edit</Button>
                <Button size="small" startIcon={<Delete sx={{ fontSize: "13px !important" }} />} onClick={() => handleDelete(row)}
                  sx={{ textTransform: "none", color: "#dc2626", fontSize: "0.75rem", borderRadius: "6px", "&:hover": { bgcolor: "#fef2f2" } }}>Delete</Button>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {/* ════════════════════════════════════════════════════════════════
          DESKTOP TABLE
      ════════════════════════════════════════════════════════════════ */}
      {!isMobile && (
        <Paper elevation={0} sx={{ borderRadius: "10px", border: "1px solid #e0eaf5", overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {["#","Employee","Designation","Department","Work Mode","Status","Contact","Actions"].map((h) => (
                    <TableCell key={h} sx={{
                      bgcolor: "#1a3c6e", color: "#fff", fontWeight: 700,
                      fontSize: "0.72rem", letterSpacing: 0.6,
                      whiteSpace: "nowrap", py: 1.75, borderBottom: "none",
                      "&:first-of-type": { pl: 2.5 },
                    }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                      <PeopleAlt sx={{ fontSize: 44, color: "#d0dcea", mb: 1.5, display: "block", mx: "auto" }} />
                      <Typography color="text.secondary" fontWeight={600} fontSize="0.95rem">No employees found</Typography>
                      <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: "block" }}>
                        Try adjusting filters or add a new employee
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : filtered.map((row, idx) => (
                  <TableRow key={row._id} sx={{
                    bgcolor: idx % 2 === 0 ? "#fff" : "#fafbfd",
                    "&:hover": { bgcolor: "#f0f6ff" },
                    "& td": { borderColor: "#f0f4f8" },
                    transition: "background 0.15s",
                  }}>
                    {/* # */}
                    <TableCell sx={{ fontSize: "0.78rem", color: "#aab8cc", py: 1.75, fontWeight: 600, pl: 2.5 }}>
                      {idx + 1}
                    </TableCell>
                    {/* Employee */}
                    <TableCell sx={{ py: 1.75 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <AvatarBox firstName={row.firstName} lastName={row.lastName} />
                        <Box>
                          <Typography fontWeight={700} color="#1a2740" fontSize="0.875rem">
                            {row.firstName} {row.lastName}
                          </Typography>
                          <Typography fontSize="0.72rem" color="#8faabf" fontWeight={500}>{row.employeeId}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    {/* Designation */}
                    <TableCell sx={{ fontSize: "0.84rem", py: 1.75, color: "#2a3e5a", fontWeight: 500 }}>
                      {row.designation || "—"}
                    </TableCell>
                    {/* Department */}
                    <TableCell sx={{ fontSize: "0.84rem", py: 1.75, color: "#4a5e78" }}>
                      {row.department || "—"}
                    </TableCell>
                    {/* Work Mode */}
                    <TableCell sx={{ py: 1.75 }}>
                      {row.workMode ? (
                        <Box sx={{
                          display: "inline-flex", alignItems: "center",
                          px: 1.5, py: 0.4, borderRadius: "6px",
                          bgcolor: "#eef3fb", color: "#1a3c6e",
                          fontSize: "0.73rem", fontWeight: 700, letterSpacing: 0.3,
                        }}>
                          {row.workMode}
                        </Box>
                      ) : "—"}
                    </TableCell>
                    {/* Status */}
                    <TableCell sx={{ py: 1.75 }}>
                      <Chip label={row.employeeStatus}
                        color={STATUS_COLORS[row.employeeStatus] || "default"}
                        size="small" sx={{ fontWeight: 700, fontSize: "0.7rem", height: 22 }} />
                    </TableCell>
                    {/* Contact */}
                    <TableCell sx={{ py: 1.75 }}>
                      <Typography fontSize="0.8rem" fontWeight={600} color="#1a2740">{row.email}</Typography>
                      <Typography fontSize="0.72rem" color="#8faabf" mt={0.2}>{row.phone}</Typography>
                    </TableCell>
                    {/* Actions */}
                    <TableCell sx={{ py: 1.75 }}>
                      <Box sx={{ display: "flex", gap: 0.25 }}>
                        <Tooltip title="View Details" arrow>
                          <IconButton size="small" onClick={() => handleView(row)}
                            sx={{ color: "#1a3c6e", borderRadius: "6px", "&:hover": { bgcolor: "#eef3fb" } }}>
                            <Visibility sx={{ fontSize: 17 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit" arrow>
                          <IconButton size="small" onClick={() => handleEdit(row)}
                            sx={{ color: "#2563eb", borderRadius: "6px", "&:hover": { bgcolor: "#eff6ff" } }}>
                            <Edit sx={{ fontSize: 17 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" arrow>
                          <IconButton size="small" onClick={() => handleDelete(row)}
                            sx={{ color: "#dc2626", borderRadius: "6px", "&:hover": { bgcolor: "#fef2f2" } }}>
                            <Delete sx={{ fontSize: 17 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Table footer row count */}
          {filtered.length > 0 && (
            <Box sx={{
              px: 2.5, py: 1.25, bgcolor: "#fafbfd", borderTop: "1px solid #f0f4f8",
              display: "flex", alignItems: "center",
            }}>
              <Typography fontSize="0.75rem" color="text.secondary">
                Showing <strong style={{ color: "#1a3c6e" }}>{filtered.length}</strong> of {employees.length} employees
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      {/* ── Form Modal ──────────────────────────────────────────────────── */}
      <EmployeeFormModal open={formOpen} onClose={() => setFormOpen(false)} onSave={handleSave} editData={editData} />

      {/* ── Details Modal ───────────────────────────────────────────────── */}
      <MasterDetailsModal open={detailOpen} onClose={() => setDetailOpen(false)}
        title="Employee Details" onEdit={() => { setDetailOpen(false); handleEdit(detailData); }}>
        {detailData && (
          <Box>
            {/* Profile badge */}
            <Box sx={{
              display: "flex", alignItems: "center", gap: 2, p: 2.5, mb: 3, mt: 2,
              background: "linear-gradient(135deg, #1a3c6e 0%, #1e4d8c 100%)",
              borderRadius: "10px",
            }}>
              <AvatarBox firstName={detailData.firstName} lastName={detailData.lastName} size={52} fontSize="1.1rem" />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography fontWeight={800} color="#fff" fontSize="1.05rem">
                  {detailData.firstName} {detailData.lastName}
                </Typography>
                <Typography fontSize="0.8rem" sx={{ color: "rgba(255,255,255,0.75)", mt: 0.2 }}>
                  {detailData.designation}{detailData.department ? ` · ${detailData.department}` : ""}
                </Typography>
                <Typography fontSize="0.72rem" sx={{ color: "rgba(255,255,255,0.5)", mt: 0.1 }}>{detailData.employeeId}</Typography>
              </Box>
              <Chip label={detailData.employeeStatus}
                color={STATUS_COLORS[detailData.employeeStatus] || "default"}
                size="small" sx={{ fontWeight: 700, fontSize: "0.72rem" }} />
            </Box>

            {/* Basic */}
            <SectionHead>Basic Information</SectionHead>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5, mb: 3 }}>
              <MasterDetailsModal.DetailItem label="First Name"   value={detailData.firstName} />
              <MasterDetailsModal.DetailItem label="Last Name"    value={detailData.lastName} />
              <MasterDetailsModal.DetailItem label="Employee ID"  value={detailData.employeeId} />
              <MasterDetailsModal.DetailItem label="Gender"       value={detailData.gender} />
              <MasterDetailsModal.DetailItem label="Email"        value={detailData.email} />
              <MasterDetailsModal.DetailItem label="Phone"        value={detailData.phone} />
              <MasterDetailsModal.DetailItem label="Home Town"    value={detailData.homeTown} />
              <MasterDetailsModal.DetailItem label="Date of Birth" value={detailData.dateOfBirth} />
            </Box>

            {/* Employment */}
            <SectionHead>Employment Details</SectionHead>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5, mb: 3 }}>
              <MasterDetailsModal.DetailItem label="Date of Joining"      value={detailData.dateOfJoining} />
              <MasterDetailsModal.DetailItem label="Status"               value={detailData.employeeStatus} />
              <MasterDetailsModal.DetailItem label="Overall Experience"   value={detailData.overallExperience ? `${detailData.overallExperience} yrs` : "—"} />
              <MasterDetailsModal.DetailItem label="Relevant Experience"  value={detailData.relevantExperience ? `${detailData.relevantExperience} yrs` : "—"} />
            </Box>

            {/* Organization */}
            <SectionHead>Organization Details</SectionHead>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
              <MasterDetailsModal.DetailItem label="Designation"       value={detailData.designation} />
              <MasterDetailsModal.DetailItem label="Department"        value={detailData.department} />
              <MasterDetailsModal.DetailItem label="Reporting Manager" value={detailData.reportingManager} />
              <MasterDetailsModal.DetailItem label="Work Mode"         value={detailData.workMode} />
              <MasterDetailsModal.DetailItem label="Base Location"     value={detailData.baseLocation} />
              <MasterDetailsModal.DetailItem label="Current Location"  value={detailData.currentLocation} />
            </Box>
          </Box>
        )}
      </MasterDetailsModal>

      {/* ── Delete Dialog ───────────────────────────────────────────────── */}
      <MasterDeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        itemName="employee"
      />
    </Box>
  );
}

/* ── Internal section heading used in details modal ────────────────────── */
function SectionHead({ children }) {
  return (
    <Box sx={{ mb: 1.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ width: 3, height: 13, bgcolor: "#1a3c6e", borderRadius: 4 }} />
        <Typography sx={{ fontSize: "0.65rem", fontWeight: 800, color: "#1a3c6e", letterSpacing: 1.6, textTransform: "uppercase" }}>
          {children}
        </Typography>
      </Box>
      <Divider sx={{ mt: 0.75, mb: 1.5, borderColor: "#dce8f5" }} />
    </Box>
  );
}