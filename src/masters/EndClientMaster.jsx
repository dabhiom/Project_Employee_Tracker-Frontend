import { useState, useEffect } from "react";
import {
  Box,
  Button,
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
  Snackbar,
  Alert,
} from "@mui/material";
import { Add, Search, Visibility, Edit, Delete } from "@mui/icons-material";

import MasterDetailsModal, { Section, DetailItem, TwoCol } from "../Components/MasterDetailsModal";
import MasterFormDialog, { FullWidthField } from "../Components/MasterFormDialog";
import MasterDeleteDialog from "../Components/MasterDeleteDialog";
import MobileCard from "../Components/MobileCard";

export default function EndClientMaster() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  /* ── State ───────────────────────────────────────────────────────────── */
  const [clients, setClients] = useState(() => {
    try {
      const stored = localStorage.getItem("endClients");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  /* ── Persist ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    localStorage.setItem("endClients", JSON.stringify(clients));
  }, [clients]);

  /* ── Filtered list ───────────────────────────────────────────────────── */
  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  /* ── Handlers ────────────────────────────────────────────────────────── */
  const handleAdd = () => {
    setEditData(null);
    setForm({ name: "", email: "", phone: "", address: "" });
    setFormOpen(true);
  };

  const handleEdit = (client) => {
    setEditData(client);
    setForm({ name: client.name, email: client.email, phone: client.phone, address: client.address });
    setFormOpen(true);
  };

  const handleView = (client) => {
    setDetailData(client);
    setDetailOpen(true);
  };

  const openDeleteConfirm = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleDelete = () => {
    setClients(clients.filter((c) => c._id !== deleteId));
    setDeleteOpen(false);
    setToast({ open: true, message: "End Client deleted successfully", severity: "success" });
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      setToast({ open: true, message: "Client name is required", severity: "error" });
      return;
    }
    const duplicate = clients.find(
      (c) => c.name.toLowerCase() === form.name.toLowerCase() &&
        (!editData || c._id !== editData._id)
    );
    if (duplicate) {
      setToast({ open: true, message: "End Client already exists", severity: "error" });
      return;
    }
    if (editData) {
      setClients(clients.map((c) => c._id === editData._id ? { ...c, ...form } : c));
      setToast({ open: true, message: "End Client updated successfully", severity: "success" });
    } else {
      setClients([...clients, { _id: Date.now().toString(), ...form }]);
      setToast({ open: true, message: "End Client created successfully", severity: "success" });
    }
    setFormOpen(false);
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
            End Clients
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
          Add End Client
        </Button>
      </Box>

      {/* ── Search Bar ──────────────────────────────────────────────────── */}
      <TextField
        placeholder="Search by name, email or phone..."
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

      {/* ── Desktop Table ────────────────────────────────────────────────── */}
      {!isMobile && (
        <Paper
          elevation={0}
          sx={{ border: "1px solid #e0e9f5", borderRadius: 3, overflow: "hidden" }}
        >
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {["#", "Name", "Email", "Phone", "Address", "Actions"].map((h) => (
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
                    <TableCell colSpan={6} align="center" sx={{ py: 5, color: "text.secondary" }}>
                      No end clients found.
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
                      <TableCell sx={{ fontWeight: 600 }}>{row.name}</TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>{row.email || "—"}</TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>{row.phone || "—"}</TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>{row.address || "—"}</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Tooltip title="View">
                          <IconButton size="small" onClick={() => handleView(row)} sx={{ color: "#4caf50", "&:hover": { bgcolor: "#e8f5e9" } }}>
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => handleEdit(row)} sx={{ color: "#2196f3", "&:hover": { bgcolor: "#e3f2fd" } }}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" onClick={() => openDeleteConfirm(row._id)} sx={{ color: "#f44336", "&:hover": { bgcolor: "#ffebee" } }}>
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
      {isMobile && (
        <Box>
          {filtered.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6, color: "text.secondary" }}>
              <Typography>No end clients found.</Typography>
            </Box>
          ) : (
            filtered.map((row, idx) => (
              <MobileCard
                key={row._id}
                index={idx + 1}
                title={row.name}
                fields={[
                  { label: "Email", value: row.email },
                  { label: "Phone", value: row.phone },
                  { label: "Address", value: row.address },
                ]}
                onView={() => handleView(row)}
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
        title={editData ? "Edit End Client" : "Add End Client"}
        onSave={handleSave}
        saveLabel={editData ? "Update" : "Save"}
      >
        <TextField
          label="Name *"
          fullWidth
          size="small"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <TextField
          label="Email"
          fullWidth
          size="small"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <TextField
          label="Phone"
          fullWidth
          size="small"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        {/* <FullWidthField> */}
          <TextField
            label="Address"
            fullWidth
            size="small"
            multiline
            rows={2}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        {/* </FullWidthField> */}
      </MasterFormDialog>

      {/* ── Delete Dialog ─────────────────────────────────────────────────── */}
      <MasterDeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        itemName="end client"
      />

      {/* ── Details Modal ─────────────────────────────────────────────────── */}
      <MasterDetailsModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title="End Client Details"
        onEdit={() => { setDetailOpen(false); if (detailData) handleEdit(detailData); }}
        editLabel="Edit Client"
        maxWidth="sm"
      >
        {detailData && (
          <>
            <Section title="Information" />
            <TwoCol>
              <Box sx={{ flex: 1 }}>
                <DetailItem label="Name" value={detailData.name} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <DetailItem label="Email" value={detailData.email} />
              </Box>
            </TwoCol>
            <TwoCol>
              <Box sx={{ flex: 1 }}>
                <DetailItem label="Phone" value={detailData.phone} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <DetailItem label="Address" value={detailData.address} />
              </Box>
            </TwoCol>
          </>
        )}
      </MasterDetailsModal>

      {/* ── Snackbar ─────────────────────────────────────────────────────── */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={toast.severity} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
