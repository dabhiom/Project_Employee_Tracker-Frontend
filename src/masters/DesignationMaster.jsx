import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Chip,
  InputAdornment,
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
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Add, Search, Visibility, Edit, Delete } from "@mui/icons-material";

import MasterDetailsModal, {
  Section,
  DetailItem,
  TwoCol,
} from "../Components/MasterDetailsModal";
import MasterFormDialog, { FullWidthField } from "../Components/MasterFormDialog";
import { useToast } from "../Components/ToastProvider";
import MasterDeleteDialog from "../Components/MasterDeleteDialog";
import MobileCard from "../Components/MobileCard";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/designations`;

export default function DesignationMaster() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { showToast } = useToast();

  /* ── State ───────────────────────────────────────────────────────────── */
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ designationName: "", status: true });

  /* ── Auth headers ────────────────────────────────────────────────────── */
  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
  });

  /* ── Fetch all designations ──────────────────────────────────────────── */
  const fetchDesignations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, { headers: authHeaders() });
      if (!res.ok) throw new Error("Failed to fetch designations");
      const data = await res.json();
      setDesignations(Array.isArray(data) ? data : data.data ?? []);
    } catch (err) {
      showToast(err.message || "Error fetching designations", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchDesignations();
  }, [fetchDesignations]);

  /* ── Filtered list ───────────────────────────────────────────────────── */
  const filtered = designations.filter((d) =>
    (d.designationName || "").toLowerCase().includes(search.toLowerCase())
  );

  /* ── Handlers ────────────────────────────────────────────────────────── */
  const handleAdd = () => {
    setEditData(null);
    setForm({ designationName: "", status: true });
    setFormOpen(true);
  };

  const handleEdit = (des) => {
    setEditData(des);
    setForm({ designationName: des.designationName, status: des.status ?? true });
    setFormOpen(true);
  };

  const handleView = (des) => {
    setDetailData(des);
    setDetailOpen(true);
  };

  const openDeleteConfirm = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  /* ── Delete ──────────────────────────────────────────────────────────── */
  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/${deleteId}`, { method: "DELETE", headers: authHeaders() });
      if (!res.ok) throw new Error("Failed to delete designation");
      setDesignations((prev) => prev.filter((d) => d._id !== deleteId));
      showToast("Designation deleted successfully", "success");
    } catch (err) {
      showToast(err.message || "Error deleting designation", "error");
    } finally {
      setDeleteOpen(false);
    }
  };

  /* ── Save (Create / Update) ──────────────────────────────────────────── */
  const handleSave = async () => {
    if (!form.designationName.trim()) {
      showToast("Designation name is required", "error");
      return;
    }
    const duplicate = designations.find(
      (d) =>
        d.designationName.toLowerCase() === form.designationName.toLowerCase() &&
        (!editData || d._id !== editData._id)
    );
    if (duplicate) {
      showToast("Designation already exists", "error");
      return;
    }

    setSaving(true);
    try {
      if (editData) {
        /* ── PUT ── */
        const res = await fetch(`${API_URL}/${editData._id}`, {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Failed to update designation");
        const updated = await res.json();
        setDesignations((prev) =>
          prev.map((d) =>
            d._id === editData._id ? { ...d, ...(updated.data ?? updated) } : d
          )
        );
        showToast("Designation updated successfully", "success");
      } else {
        /* ── POST ── */
        const res = await fetch(API_URL, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Failed to create designation");
        const created = await res.json();
        setDesignations((prev) => [...prev, created.data ?? created]);
        showToast("Designation created successfully", "success");
      }
      setFormOpen(false);
    } catch (err) {
      showToast(err.message || "Error saving designation", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ═══════════════════════════════════════════════════════════════════════ */
  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: "#f0f4f8", minHeight: "100vh" }}>

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} color="#1a3c6e">
            Designations
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {filtered.length} record{filtered.length !== 1 ? "s" : ""} found
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
          sx={{
            bgcolor: "#1a3c6e",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            "&:hover": { bgcolor: "#15305a" },
          }}
        >
          Add Designation
        </Button>
      </Box>

      {/* ── Search Bar ──────────────────────────────────────────────────── */}
      <TextField
        placeholder="Search by designation name..."
        size="small"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          mb: 2.5,
          bgcolor: "#fff",
          borderRadius: 2,
          "& .MuiOutlinedInput-root": { borderRadius: 2 },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: "#9e9e9e" }} />
            </InputAdornment>
          ),
        }}
      />

      {/* ── Loading State ────────────────────────────────────────────────── */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress size={32} sx={{ color: "#1a3c6e" }} />
        </Box>
      )}

      {/* ── Desktop Table ────────────────────────────────────────────────── */}
      {!isMobile && !loading && (
        <Paper
          elevation={0}
          sx={{ border: "1px solid #e0e9f5", borderRadius: 1, overflow: "hidden" }}
        >
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {["#", "Designation Name", "Status", "Actions"].map((h) => (
                    <TableCell
                      key={h}
                      sx={{
                        bgcolor: "#1a3c6e",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "0.82rem",
                        letterSpacing: 0.5,
                        whiteSpace: "nowrap",
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
                    <TableCell colSpan={4} align="center" sx={{ py: 5, color: "text.secondary" }}>
                      No designations found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((row, idx) => (
                    <TableRow
                      key={row._id}
                      hover
                      sx={{
                        bgcolor: idx % 2 === 0 ? "#fff" : "#f7faff",
                        "&:hover": { bgcolor: "#edf3fc !important" },
                      }}
                    >
                      <TableCell sx={{ color: "text.secondary", width: 50 }}>{idx + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{row.designationName}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.status ? "Active" : "Inactive"}
                          size="small"
                          sx={{
                            bgcolor: row.status ? "#e8f5e9" : "#ffebee",
                            color: row.status ? "#2e7d32" : "#c62828",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(row)}
                            sx={{ color: "#2196f3", "&:hover": { bgcolor: "#e3f2fd" } }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => openDeleteConfirm(row._id)}
                            sx={{ color: "#f44336", "&:hover": { bgcolor: "#ffebee" } }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* ── Mobile Cards ─────────────────────────────────────────────────── */}
      {isMobile && !loading && (
        <Box>
          {filtered.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>
              <Typography>No designations found.</Typography>
            </Box>
          ) : (
            filtered.map((row, idx) => (
              <MobileCard
                key={row._id}
                index={idx + 1}
                title={row.designationName}
                fields={[
                  { label: "Status", value: row.status ? "Active" : "Inactive" },
                ]}
                onEdit={() => handleEdit(row)}
                onDelete={() => openDeleteConfirm(row._id)}
              />
            ))
          )}
        </Box>
      )}

      {/* ── Form Dialog ──────────────────────────────────────────────────── */}
      <MasterFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editData ? "Edit Designation" : "Add Designation"}
        onSave={handleSave}
        saveLabel={editData ? "Update" : "Save"}
        saving={saving}
      >
        <TextField
          label="Designation Name *"
          fullWidth
          size="small"
          value={form.designationName}
          onChange={(e) => setForm({ ...form, designationName: e.target.value })}
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
          <Typography variant="body2" color="text.secondary">Status:</Typography>
          <Chip
            label={form.status ? "Active" : "Inactive"}
            size="small"
            onClick={() => setForm({ ...form, status: !form.status })}
            sx={{
              cursor: "pointer",
              bgcolor: form.status ? "#e8f5e9" : "#ffebee",
              color: form.status ? "#2e7d32" : "#c62828",
              fontWeight: 600,
              fontSize: "0.75rem",
              "&:hover": { opacity: 0.85 },
            }}
          />
        </Box>
      </MasterFormDialog>

      {/* ── Delete Dialog ─────────────────────────────────────────────────── */}
      <MasterDeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        itemName="designation"
      />

      {/* ── Details Modal ─────────────────────────────────────────────────── */}
      <MasterDetailsModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title="Designation Details"
        onEdit={() => {
          setDetailOpen(false);
          if (detailData) handleEdit(detailData);
        }}
        editLabel="Edit Designation"
        maxWidth="sm"
      >
        {detailData && (
          <>
            <Section title="Information" />
            <TwoCol>
              <Box sx={{ flex: 1 }}>
                <DetailItem label="Designation Name" value={detailData.designationName} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <DetailItem label="Status" value={detailData.status ? "Active" : "Inactive"} />
              </Box>
            </TwoCol>
          </>
        )}
      </MasterDetailsModal>
    </Box>
  );
}