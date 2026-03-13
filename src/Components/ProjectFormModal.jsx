// src/Components/ProjectFormModal.jsx
import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box, Button, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, Divider, IconButton,
  MenuItem, Switch, TextField, Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { getAllEmployees, getAllClients } from "../api/projectApi";

const EMPTY = {
  projectName: "", clientId: "", projectType: "", projectStatus: "",
  projectStartDate: "", projectEndDate: "", projectManagerId: "",
  teamLeadId: "", projectDescription: "", clientAssetRequired: false,
  projectComment: "", status: true,
};

const toInputDate = (val) => {
  if (!val) return "";
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return val;
    return d.toISOString().split("T")[0];
  } catch { return val; }
};

const fsx = {
  bgcolor: "#fff", borderRadius: 2,
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    "&:hover fieldset":       { borderColor: "#1a3c6e" },
    "&.Mui-focused fieldset": { borderColor: "#1a3c6e" },
  },
  "& label.Mui-focused": { color: "#1a3c6e" },
};

const Section = ({ title }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="caption" fontWeight={700} color="#1a3c6e" letterSpacing={1.2} textTransform="uppercase">{title}</Typography>
    <Divider sx={{ mt: 0.5, borderColor: "#d0dff0" }} />
  </Box>
);

const Row = ({ children, gap = 2 }) => (
  <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap, mb: 2 }}>{children}</Box>
);

const ToggleCard = ({ label, sub, name, checked, onChange, successColor }) => (
  <Box sx={{ flex: 1, border: "1px solid #e0e7ef", borderRadius: 2, px: 2.5, py: 1.5, bgcolor: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <Box>
      <Typography variant="body2" fontWeight={600}>{label}</Typography>
      <Typography variant="caption" color="text.secondary">{sub}</Typography>
    </Box>
    <Switch name={name} checked={checked} onChange={onChange} color={successColor ? "success" : undefined}
      sx={!successColor ? {
        "& .MuiSwitch-switchBase.Mui-checked": { color: "#1a3c6e" },
        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#1a3c6e" },
      } : {}}
    />
  </Box>
);

/* ── ComboBox: dropdown arrow always visible + free typing allowed ───────── */
function ComboField({ label, value, onChange, options, loading, error, helperText }) {
  return (
    <Autocomplete
      freeSolo
      fullWidth
      forcePopupIcon  // ← this one line brings the dropdown arrow back always
      options={options}
      getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.label)}
      value={value || ""}
      onInputChange={(_, newVal) => onChange(newVal)}
      onChange={(_, selected) => {
        if (!selected) { onChange(""); return; }
        onChange(typeof selected === "string" ? selected : selected.value);
      }}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          size="small"
          error={error}
          helperText={helperText}
          sx={fsx}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={16} sx={{ color: "#1a3c6e" }} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}

/* ════════════════════════════════════════════════════════════════════════ */
export default function ProjectFormModal({ open, onClose, onSave, editData }) {
  const [form,       setForm]       = useState(EMPTY);
  const [errors,     setErrors]     = useState({});
  const [empOpts,    setEmpOpts]    = useState([]);
  const [clientOpts, setClientOpts] = useState([]);
  const [dropping,   setDropping]   = useState(false);

  useEffect(() => {
    if (!open) return;
    const fetchDropdowns = async () => {
      setDropping(true);
      try {
        const [empRes, clientRes] = await Promise.allSettled([
          getAllEmployees(),
          getAllClients(),
        ]);
        if (empRes.status === "fulfilled") {
          const list =
            Array.isArray(empRes.value.data)            ? empRes.value.data :
            Array.isArray(empRes.value.data?.data)      ? empRes.value.data.data :
            Array.isArray(empRes.value.data?.employees) ? empRes.value.data.employees :
            [];
          setEmpOpts(list.map((e) => ({
            label: e?.fullName || e?.name || `${e?.firstName||""} ${e?.lastName||""}`.trim() || e?.email || e?._id,
            value: e._id,
          })));
        }
        if (clientRes.status === "fulfilled") {
          const list =
            Array.isArray(clientRes.value.data)          ? clientRes.value.data :
            Array.isArray(clientRes.value.data?.data)    ? clientRes.value.data.data :
            Array.isArray(clientRes.value.data?.clients) ? clientRes.value.data.clients :
            [];
          setClientOpts(list.map((c) => ({
            label: c?.clientName || c?.name || c?.companyName || c?._id,
            value: c._id,
          })));
        }
      } catch (e) {
        console.error("Failed to load dropdowns", e);
      } finally {
        setDropping(false);
      }
    };
    fetchDropdowns();
  }, [open]);

  useEffect(() => {
    if (editData) {
      setForm({
        ...EMPTY, ...editData,
        projectStartDate: toInputDate(editData.projectStartDate),
        projectEndDate:   toInputDate(editData.projectEndDate),
      });
    } else {
      setForm(EMPTY);
    }
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
    if (!form.projectName.trim()) e.projectName      = "Required";
    if (!form.clientId)           e.clientId         = "Required";
    if (!form.projectType)        e.projectType      = "Required";
    if (!form.projectStatus)      e.projectStatus    = "Required";
    if (!form.projectStartDate)   e.projectStartDate = "Required";
    if (!form.projectManagerId)   e.projectManagerId = "Required";
    if (!form.teamLeadId)         e.teamLeadId       = "Required";
    return e;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={() => {}} fullWidth maxWidth="md" disableEscapeKeyDown
      slotProps={{ backdrop: { sx: { backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(3px)" } } }}
      PaperProps={{ sx: { borderRadius: 3, m: 2, height: "calc(100vh - 64px)", maxHeight: "calc(100vh - 64px)", display: "flex", flexDirection: "column", overflow: "hidden" } }}
    >
      <DialogTitle sx={{ bgcolor: "#1a3c6e", color: "#fff", px: 3, py: 2, flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography fontWeight={700} fontSize="1rem">
          {editData ? "✏️  Edit Project" : "➕  Create New Project"}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: "#fff" }}><Close fontSize="small" /></IconButton>
      </DialogTitle>

      <DialogContent sx={{ flexGrow: 1, overflowY: "scroll", bgcolor: "#f4f7fb", p: 3 }}>

        <Section title="Basic Information" />

        <Box sx={{ mb: 2 }}>
          <TextField fullWidth size="small" name="projectName" label="Project Name *"
            value={form.projectName} onChange={handleChange}
            error={!!errors.projectName} helperText={errors.projectName} sx={fsx} />
        </Box>

        <Row>
          <ComboField
            label="Client *"
            value={form.clientId}
            onChange={(val) => set("clientId", val)}
            options={clientOpts}
            loading={dropping}
            error={!!errors.clientId}
            helperText={errors.clientId}
          />
          <TextField fullWidth select size="small" name="projectType" label="Project Type *"
            value={form.projectType} onChange={handleChange}
            error={!!errors.projectType} helperText={errors.projectType} sx={fsx}>
            {["Fixed","BOT","Support"].map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
          </TextField>
          <TextField fullWidth select size="small" name="projectStatus" label="Project Status *"
            value={form.projectStatus} onChange={handleChange}
            error={!!errors.projectStatus} helperText={errors.projectStatus} sx={fsx}>
            {["Active","Hold","Closed"].map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
          </TextField>
        </Row>

        <Row>
          <TextField fullWidth size="small" type="date" name="projectStartDate" label="Start Date *"
            value={form.projectStartDate} onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            error={!!errors.projectStartDate} helperText={errors.projectStartDate} sx={fsx} />
          <TextField fullWidth size="small" type="date" name="projectEndDate" label="End Date"
            value={form.projectEndDate} onChange={handleChange}
            InputLabelProps={{ shrink: true }} sx={fsx} />
        </Row>

        <Divider sx={{ my: 3, borderColor: "#dce6f5" }} />
        <Section title="Team Assignment" />

        <Row>
          <ComboField
            label="Project Manager *"
            value={form.projectManagerId}
            onChange={(val) => set("projectManagerId", val)}
            options={empOpts}
            loading={dropping}
            error={!!errors.projectManagerId}
            helperText={errors.projectManagerId}
          />
          <ComboField
            label="Team Lead *"
            value={form.teamLeadId}
            onChange={(val) => set("teamLeadId", val)}
            options={empOpts}
            loading={dropping}
            error={!!errors.teamLeadId}
            helperText={errors.teamLeadId}
          />
        </Row>

        <Divider sx={{ my: 3, borderColor: "#dce6f5" }} />
        <Section title="Additional Details" />

        <Row>
          <TextField fullWidth size="small" multiline rows={4} name="projectDescription" label="Project Description"
            value={form.projectDescription} onChange={handleChange} sx={fsx} />
          <TextField fullWidth size="small" multiline rows={4} name="projectComment" label="Project Comment"
            value={form.projectComment} onChange={handleChange} sx={fsx} />
        </Row>

        <Row>
          <ToggleCard label="Client Asset Required" sub="Does this project need client-side assets?"
            name="clientAssetRequired" checked={form.clientAssetRequired} onChange={handleChange} />
          <ToggleCard label="Active Status" sub="Is this project currently active?"
            name="status" checked={form.status} onChange={handleChange} successColor />
        </Row>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, bgcolor: "#fff", borderTop: "1px solid #e0e7ef", flexShrink: 0, gap: 1.5 }}>
        <Button variant="outlined" onClick={onClose}
          sx={{ borderRadius: 2, textTransform: "none", borderColor: "#1a3c6e", color: "#1a3c6e", px: 3, "&:hover": { bgcolor: "#e8eef7", borderColor: "#1a3c6e" } }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, bgcolor: "#1a3c6e", px: 4, "&:hover": { bgcolor: "#15305a" } }}>
          {editData ? "Update Project" : "Save Project"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}