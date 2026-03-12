import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
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
  Delete,
  FilterList,
  Email,
  Phone,
  Person,
  Business,
} from "@mui/icons-material";
import EmployeeFormModal from "../Components/EmployeeFormModal";
import MasterDetailsModal from "../Components/MasterDetailsModal";
import { useToast } from "../Components/ToastProvider";

/* ── Seed data ─────────────────────────────────────────────────────────── */
const SEED = [
  {
    _id: "1",
    firstName: "Rahul",
    lastName: "Sharma",
    employeeId: "EMP001",
    gender: "Male",
    dateOfBirth: "1990-05-15",
    email: "rahul.sharma@company.com",
    phone: "+91-9876543210",
    dateOfJoining: "2020-01-15",
    employeeStatus: "Active",
    designation: "Manager",
    department: "IT",
    reportingManager: "CEO",
    baseLocation: "Mumbai",
    currentLocation: "Mumbai",
    workMode: "WFH",
    overallExperience: "8",
    relevantExperience: "6",
    homeTown: "Delhi",
    passportAvailable: true,
    passportNumber: "P1234567",
    status: true,
    createdAt: "2020-01-10",
  },
  {
    _id: "2",
    firstName: "Priya",
    lastName: "Mehta",
    employeeId: "EMP002",
    gender: "Female",
    dateOfBirth: "1992-08-20",
    email: "priya.mehta@company.com",
    phone: "+91-9876543211",
    dateOfJoining: "2021-03-01",
    employeeStatus: "Active",
    designation: "Developer",
    department: "IT",
    reportingManager: "Rahul Sharma",
    baseLocation: "Bangalore",
    currentLocation: "Bangalore",
    workMode: "WFO",
    overallExperience: "5",
    relevantExperience: "4",
    homeTown: "Chennai",
    passportAvailable: false,
    passportNumber: "",
    status: true,
    createdAt: "2021-02-25",
  },
  {
    _id: "3",
    firstName: "Ankit",
    lastName: "Joshi",
    employeeId: "EMP003",
    gender: "Male",
    dateOfBirth: "1988-12-10",
    email: "ankit.joshi@company.com",
    phone: "+91-9876543212",
    dateOfJoining: "2019-06-01",
    employeeStatus: "Notice",
    designation: "Analyst",
    department: "Finance",
    reportingManager: "Priya Mehta",
    baseLocation: "Delhi",
    currentLocation: "Delhi",
    workMode: "Hybrid",
    overallExperience: "10",
    relevantExperience: "8",
    homeTown: "Mumbai",
    passportAvailable: true,
    passportNumber: "Q9876543",
    status: true,
    createdAt: "2019-05-25",
  },
  {
    _id: "4",
    firstName: "Deepak",
    lastName: "Nair",
    employeeId: "EMP004",
    gender: "Male",
    dateOfBirth: "1991-03-22",
    email: "deepak.nair@company.com",
    phone: "+91-9876543213",
    dateOfJoining: "2020-07-10",
    employeeStatus: "Active",
    designation: "Team Lead",
    department: "IT",
    reportingManager: "Rahul Sharma",
    baseLocation: "Hyderabad",
    currentLocation: "Hyderabad",
    workMode: "Hybrid",
    overallExperience: "9",
    relevantExperience: "7",
    homeTown: "Bangalore",
    passportAvailable: true,
    passportNumber: "D1234567",
    status: true,
    createdAt: "2020-06-30",
  },
];

const STATUS_COLORS = { Active: "success", Notice: "warning", Exited: "error" };
const DESIGNATION_OPTIONS = ["Developer", "Manager", "Analyst", "Designer", "Team Lead", "Senior Developer"];

/* ── Small info row used inside mobile card ─────────────────────────────── */
const InfoRow = ({ icon: Icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <Icon sx={{ fontSize: 14, color: "#90a4ae" }} />
    <Typography variant="caption" color="text.secondary">
      {label}:
    </Typography>
    <Typography variant="caption" fontWeight={600} color="#1a1a2e">
      {value || "—"}
    </Typography>
  </Box>
);

/* ════════════════════════════════════════════════════════════════════════ */
export default function EmployeesPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { showToast } = useToast();

  const [employees, setEmployees] = useState(SEED);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [designationFilter, setDesignationFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  /* ── Filtered list ────────────────────────────────────────────────────── */
  const filtered = employees.filter((e) => {
    const fullName = `${e.firstName} ${e.lastName}`.toLowerCase();
    const matchSearch =
      fullName.includes(search.toLowerCase()) ||
      e.employeeId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || e.employeeStatus === statusFilter;
    const matchDesignation = designationFilter === "All" || e.designation === designationFilter;
    return matchSearch && matchStatus && matchDesignation;
  });

  /* ── Handlers ─────────────────────────────────────────────────────────── */
  const handleAdd = () => {
    setEditData(null);
    setFormOpen(true);
  };

  const handleEdit = (row) => {
    setEditData(row);
    setFormOpen(true);
  };

  const handleView = (row) => {
    setDetailData(row);
    setDetailOpen(true);
  };

  const handleDelete = (row) => {
    setDeleteTarget(row);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setEmployees((prev) => prev.filter((e) => e._id !== deleteTarget._id));
      setDeleteOpen(false);
      setDeleteTarget(null);
      showToast("Employee deleted successfully", "success");
    }
  };

  const handleSave = (formData) => {
    if (editData) {
      setEmployees((prev) =>
        prev.map((e) => (e._id === editData._id ? { ...formData, _id: editData._id } : e))
      );
      showToast("Employee updated successfully", "success");
    } else {
      setEmployees((prev) => [
        ...prev,
        {
          ...formData,
          _id: Date.now().toString(),
          createdAt: new Date().toISOString().split("T")[0],
        },
      ]);
      showToast("Employee added successfully", "success");
    }
    setFormOpen(false);
  };

  /* ── Stats ────────────────────────────────────────────────────────────── */
  const stats = [
    { label: "Total Employees", value: employees.length, color: "#1a3c6e" },
    {
      label: "Active",
      value: employees.filter((e) => e.employeeStatus === "Active").length,
      color: "#2e7d32",
    },
    {
      label: "On Notice",
      value: employees.filter((e) => e.employeeStatus === "Notice").length,
      color: "#e65100",
    },
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
            Employees
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Manage employee information, roles and details.
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
          {isMobile ? "New" : "Add Employee"}
        </Button>
      </Box>

      {/* ── Stats Cards ─────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
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
          placeholder="Search employee name or ID…"
          size="small"
          fullWidth={isMobile}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ bgcolor: "#fff", borderRadius: 2, minWidth: { sm: 250 } }}
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
          sx={{ bgcolor: "#fff", borderRadius: 2, minWidth: { sm: 140 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterList fontSize="small" sx={{ color: "#90a4ae" }} />
              </InputAdornment>
            ),
          }}
        >
          {["All", "Active", "Notice", "Exited"].map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          size="small"
          fullWidth={isMobile}
          value={designationFilter}
          onChange={(e) => setDesignationFilter(e.target.value)}
          sx={{ bgcolor: "#fff", borderRadius: 2, minWidth: { sm: 150 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person fontSize="small" sx={{ color: "#90a4ae" }} />
              </InputAdornment>
            ),
          }}
        >
          {["All", ...DESIGNATION_OPTIONS].map((d) => (
            <MenuItem key={d} value={d}>
              {d}
            </MenuItem>
          ))}
        </TextField>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ ml: { sm: "auto" }, whiteSpace: "nowrap" }}
        >
          <strong>{filtered.length}</strong> of {employees.length} employees
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
              <Typography color="text.secondary">No employees found.</Typography>
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
                  transition: "box-shadow 0.2s",
                  "&:hover": { boxShadow: "0 2px 8px rgba(26,60,110,0.1)" },
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
                  <Box>
                    <Typography fontWeight={700} color="#fff" fontSize="0.95rem">
                      {row.firstName} {row.lastName}
                    </Typography>
                    <Typography fontSize="0.75rem" color="#b3d9ff">
                      {row.employeeId}
                    </Typography>
                  </Box>
                  <Chip
                    label={row.employeeStatus}
                    color={STATUS_COLORS[row.employeeStatus] || "default"}
                    size="small"
                    sx={{ fontSize: "0.68rem", fontWeight: 700, height: 22 }}
                  />
                </Box>

                {/* Card Body */}
                <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                  <Divider sx={{ borderColor: "#f0f4f8" }} />
                  <InfoRow icon={Business} label="Designation" value={row.designation} />
                  <InfoRow icon={Business} label="Department" value={row.department} />
                  <InfoRow icon={Email} label="Email" value={row.email} />
                  <InfoRow icon={Phone} label="Phone" value={row.phone} />
                  <InfoRow icon={Person} label="Manager" value={row.reportingManager} />
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
                  {["#", "Employee", "Designation", "Department", "Status", "Contact", "Actions"].map((h) => (
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
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6, color: "text.secondary" }}>
                      No employees found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((row, idx) => (
                    <TableRow
                      key={row._id}
                      hover
                      sx={{
                        "&:hover": {
                          bgcolor: "#f0f7ff",
                          boxShadow: "inset 0 0 0 1px #d4e3f7",
                        },
                        bgcolor: idx % 2 === 0 ? "#fff" : "#fafbfc",
                        transition: "all 0.2s",
                      }}
                    >
                      <TableCell sx={{ fontSize: "0.82rem", color: "#888", py: 1.5 }}>
                        {idx + 1}
                      </TableCell>
                      {/* Employee Name + ID */}
                      <TableCell sx={{ py: 1.5 }}>
                        <Box>
                          <Typography fontWeight={600} color="#1a3c6e" fontSize="0.9rem">
                            {row.firstName} {row.lastName}
                          </Typography>
                          <Typography fontSize="0.75rem" color="text.secondary">
                            {row.employeeId}
                          </Typography>
                        </Box>
                      </TableCell>
                      {/* Designation */}
                      <TableCell sx={{ fontSize: "0.85rem", py: 1.5 }}>
                        {row.designation}
                      </TableCell>
                      {/* Department */}
                      <TableCell sx={{ fontSize: "0.85rem", py: 1.5 }}>
                        {row.department}
                      </TableCell>
                      {/* Status Badge */}
                      <TableCell sx={{ py: 1.5 }}>
                        <Chip
                          label={row.employeeStatus}
                          color={STATUS_COLORS[row.employeeStatus] || "default"}
                          size="small"
                          sx={{ fontWeight: 600, fontSize: "0.72rem" }}
                        />
                      </TableCell>
                      {/* Contact (Email + Phone) */}
                      <TableCell sx={{ py: 1.5 }}>
                        <Box>
                          <Typography fontSize="0.82rem" fontWeight={500} color="#1a1a2e">
                            {row.email}
                          </Typography>
                          <Typography fontSize="0.75rem" color="text.secondary">
                            {row.phone}
                          </Typography>
                        </Box>
                      </TableCell>
                      {/* Actions */}
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
                          <Tooltip title="Edit Employee">
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(row)}
                              sx={{ color: "#2196f3" }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Employee">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(row)}
                              sx={{ color: "#d32f2f" }}
                            >
                              <Delete fontSize="small" />
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
      <EmployeeFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        editData={editData}
      />

      {/* Details Modal */}
      <MasterDetailsModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title="Employee Details"
        onEdit={() => {
          setDetailOpen(false);
          handleEdit(detailData);
        }}
      >
        <Box>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              fontWeight={700}
              color="#1a3c6e"
              letterSpacing={1.2}
              textTransform="uppercase"
            >
              Basic Information
            </Typography>
            <Divider sx={{ mt: 0.5, borderColor: "#d0dff0" }} />
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5, mb: 2.5 }}>
            <MasterDetailsModal.DetailItem label="First Name" value={detailData?.firstName} />
            <MasterDetailsModal.DetailItem label="Last Name" value={detailData?.lastName} />
            <MasterDetailsModal.DetailItem label="Employee ID" value={detailData?.employeeId} />
            <MasterDetailsModal.DetailItem label="Gender" value={detailData?.gender} />
            <MasterDetailsModal.DetailItem label="Email" value={detailData?.email} />
            <MasterDetailsModal.DetailItem label="Phone" value={detailData?.phone} />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              fontWeight={700}
              color="#1a3c6e"
              letterSpacing={1.2}
              textTransform="uppercase"
            >
              Employment Details
            </Typography>
            <Divider sx={{ mt: 0.5, borderColor: "#d0dff0" }} />
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5, mb: 2.5 }}>
            <MasterDetailsModal.DetailItem label="Date of Joining" value={detailData?.dateOfJoining} />
            <MasterDetailsModal.DetailItem label="Status" value={detailData?.employeeStatus} />
            <MasterDetailsModal.DetailItem label="Overall Experience" value={`${detailData?.overallExperience} years`} />
            <MasterDetailsModal.DetailItem label="Relevant Experience" value={`${detailData?.relevantExperience} years`} />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              fontWeight={700}
              color="#1a3c6e"
              letterSpacing={1.2}
              textTransform="uppercase"
            >
              Organization Details
            </Typography>
            <Divider sx={{ mt: 0.5, borderColor: "#d0dff0" }} />
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5, mb: 2.5 }}>
            <MasterDetailsModal.DetailItem label="Designation" value={detailData?.designation} />
            <MasterDetailsModal.DetailItem label="Department" value={detailData?.department} />
            <MasterDetailsModal.DetailItem label="Reporting Manager" value={detailData?.reportingManager} />
            <MasterDetailsModal.DetailItem label="Work Mode" value={detailData?.workMode} />
            <MasterDetailsModal.DetailItem label="Base Location" value={detailData?.baseLocation} />
            <MasterDetailsModal.DetailItem label="Current Location" value={detailData?.currentLocation} />
          </Box>
        </Box>
      </MasterDetailsModal>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle sx={{ bgcolor: "#1a3c6e", color: "#fff" }}>
          Delete Employee
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography>
            Are you sure you want to delete <strong>{deleteTarget?.firstName} {deleteTarget?.lastName}</strong>?
          </Typography>
          <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", p: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setDeleteOpen(false)}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              borderColor: "#1a3c6e",
              color: "#1a3c6e",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmDelete}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              bgcolor: "#d32f2f",
              "&:hover": { bgcolor: "#b71c1c" },
            }}
          >
            Delete
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}
