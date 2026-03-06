import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";

/* ── Default empty form ─────────────────────────────────────────────────── */
const EMPTY = {
  projectName: "",
  clientId: "",
  projectType: "",
  projectStatus: "",
  projectStartDate: "",
  projectEndDate: "",
  projectManagerId: "",
  teamLeadId: "",
  projectDescription: "",
  clientAssetRequired: false,
  projectComment: "",
  status: true,
};

/* ── Dropdown options (swap with API later) ─────────────────────────────── */
const CLIENT_OPTIONS  = ["Tecnoprism", "Infosys", "TCS", "Wipro", "HCL"];
const MANAGER_OPTIONS = ["Rahul Sharma", "Ankit Joshi", "Deepak Nair", "Priya Mehta"];
const LEAD_OPTIONS    = ["Priya Mehta", "Sneha Patel", "Kavya Rao", "Rohan Verma"];

/* ── Shared field style ─────────────────────────────────────────────────── */
const fsx = {
  bgcolor: "#fff",
  borderRadius: 2,
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    "&:hover fieldset":       { borderColor: "#1a3c6e" },
    "&.Mui-focused fieldset": { borderColor: "#1a3c6e" },
  },
  "& label.Mui-focused": { color: "#1a3c6e" },
};

/* ── Section heading with divider ───────────────────────────────────────── */
const Section = ({ title }) => (
  <Box sx={{ mb: 2 }}>
    <Typography
      variant="caption"
      fontWeight={700}
      color="#1a3c6e"
      letterSpacing={1.2}
      textTransform="uppercase"
    >
      {title}
    </Typography>
    <Divider sx={{ mt: 0.5, borderColor: "#d0dff0" }} />
  </Box>
);

/* ── Row helper: puts children side-by-side, wraps on small screens ─────── */
const Row = ({ children, gap = 2 }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      gap,
      mb: 2,
    }}
  >
    {children}
  </Box>
);

/* ── Toggle card ────────────────────────────────────────────────────────── */
const ToggleCard = ({ label, sub, name, checked, onChange, successColor }) => (
  <Box
    sx={{
      flex: 1,
      border: "1px solid #e0e7ef",
      borderRadius: 2,
      px: 2.5,
      py: 1.5,
      bgcolor: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <Box>
      <Typography variant="body2" fontWeight={600}>{label}</Typography>
      <Typography variant="caption" color="text.secondary">{sub}</Typography>
    </Box>
    <Switch
      name={name}
      checked={checked}
      onChange={onChange}
      color={successColor ? "success" : undefined}
      sx={
        !successColor
          ? {
              "& .MuiSwitch-switchBase.Mui-checked": { color: "#1a3c6e" },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                bgcolor: "#1a3c6e",
              },
            }
          : {}
      }
    />
  </Box>
);

/* ════════════════════════════════════════════════════════════════════════ */
export default function ProjectFormModal({ open, onClose, onSave, editData }) {
  const [form,   setForm]   = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(editData ? { ...EMPTY, ...editData } : EMPTY);
    setErrors({});
  }, [editData, open]);

  const set = (name, value) => {
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    set(name, type === "checkbox" ? checked : value);
  };

  const validate = () => {
    const e = {};
    if (!form.projectName.trim())  e.projectName      = "Required";
    if (!form.clientId)            e.clientId         = "Required";
    if (!form.projectType)         e.projectType      = "Required";
    if (!form.projectStatus)       e.projectStatus    = "Required";
    if (!form.projectStartDate)    e.projectStartDate = "Required";
    if (!form.projectManagerId)    e.projectManagerId = "Required";
    if (!form.teamLeadId)          e.teamLeadId       = "Required";
    return e;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave(form);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      /* Force the paper to never exceed the viewport */
      PaperProps={{
        sx: {
          borderRadius: 3,
          m: 2,
          height: "calc(100vh - 64px)",   /* fixed height → enables scroll */
          maxHeight: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      {/* ══ FIXED HEADER ═══════════════════════════════════════════════════ */}
      <DialogTitle
        sx={{
          bgcolor: "#1a3c6e",
          color: "#fff",
          px: 3,
          py: 2,
          flexShrink: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography fontWeight={700} fontSize="1rem">
          {editData ? "✏️  Edit Project" : "➕  Create New Project"}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: "#fff" }}>
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* ══ SCROLLABLE CONTENT ═════════════════════════════════════════════ */}
      <DialogContent
        sx={{
          flexGrow: 1,
          overflowY: "scroll",   /* always show scrollbar track */
          bgcolor: "#f4f7fb",
          p: 3,
        }}
      >

        {/* ─── SECTION 1 : Basic Information ─────────────────────────── */}
        <Section title="Basic Information" />

        {/* Project Name — full width */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth size="small"
            name="projectName" label="Project Name *"
            value={form.projectName} onChange={handleChange}
            error={!!errors.projectName} helperText={errors.projectName}
            sx={fsx}
          />
        </Box>

        {/* Client | Project Type | Project Status */}
        <Row>
          <TextField
            fullWidth select size="small"
            name="clientId" label="Client *"
            value={form.clientId} onChange={handleChange}
            error={!!errors.clientId} helperText={errors.clientId}
            sx={fsx}
          >
            {CLIENT_OPTIONS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
          </TextField>

          <TextField
            fullWidth select size="small"
            name="projectType" label="Project Type *"
            value={form.projectType} onChange={handleChange}
            error={!!errors.projectType} helperText={errors.projectType}
            sx={fsx}
          >
            {["Fixed", "BOT", "Support"].map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
          </TextField>

          <TextField
            fullWidth select size="small"
            name="projectStatus" label="Project Status *"
            value={form.projectStatus} onChange={handleChange}
            error={!!errors.projectStatus} helperText={errors.projectStatus}
            sx={fsx}
          >
            {["Active", "Hold", "Closed"].map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
          </TextField>
        </Row>

        {/* Start Date | End Date */}
        <Row>
          <TextField
            fullWidth size="small" type="date"
            name="projectStartDate" label="Start Date *"
            value={form.projectStartDate} onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            error={!!errors.projectStartDate} helperText={errors.projectStartDate}
            sx={fsx}
          />
          <TextField
            fullWidth size="small" type="date"
            name="projectEndDate" label="End Date"
            value={form.projectEndDate} onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={fsx}
          />
        </Row>

        <Divider sx={{ my: 3, borderColor: "#dce6f5" }} />

        {/* ─── SECTION 2 : Team Assignment ───────────────────────────── */}
        <Section title="Team Assignment" />

        <Row>
          <TextField
            fullWidth select size="small"
            name="projectManagerId" label="Project Manager *"
            value={form.projectManagerId} onChange={handleChange}
            error={!!errors.projectManagerId} helperText={errors.projectManagerId}
            sx={fsx}
          >
            {MANAGER_OPTIONS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
          </TextField>

          <TextField
            fullWidth select size="small"
            name="teamLeadId" label="Team Lead *"
            value={form.teamLeadId} onChange={handleChange}
            error={!!errors.teamLeadId} helperText={errors.teamLeadId}
            sx={fsx}
          >
            {LEAD_OPTIONS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
          </TextField>
        </Row>

        <Divider sx={{ my: 3, borderColor: "#dce6f5" }} />

        {/* ─── SECTION 3 : Additional Details ────────────────────────── */}
        <Section title="Additional Details" />

        {/* Description | Comment */}
        <Row>
          <TextField
            fullWidth size="small" multiline rows={4}
            name="projectDescription" label="Project Description"
            value={form.projectDescription} onChange={handleChange}
            sx={fsx}
          />
          <TextField
            fullWidth size="small" multiline rows={4}
            name="projectComment" label="Project Comment"
            value={form.projectComment} onChange={handleChange}
            sx={fsx}
          />
        </Row>

        {/* Toggle cards */}
        <Row>
          <ToggleCard
            label="Client Asset Required"
            sub="Does this project need client-side assets?"
            name="clientAssetRequired"
            checked={form.clientAssetRequired}
            onChange={handleChange}
          />
          <ToggleCard
            label="Active Status"
            sub="Is this project currently active?"
            name="status"
            checked={form.status}
            onChange={handleChange}
            successColor
          />
        </Row>

      </DialogContent>

      {/* ══ FIXED FOOTER ═══════════════════════════════════════════════════ */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          bgcolor: "#fff",
          borderTop: "1px solid #e0e7ef",
          flexShrink: 0,
          gap: 1.5,
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            borderColor: "#1a3c6e",
            color: "#1a3c6e",
            px: 3,
            "&:hover": { bgcolor: "#e8eef7", borderColor: "#1a3c6e" },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 700,
            bgcolor: "#1a3c6e",
            px: 4,
            "&:hover": { bgcolor: "#15305a" },
          }}
        >
          {editData ? "Update Project" : "Save Project"}
        </Button>
      </DialogActions>

    </Dialog>
  );
}
