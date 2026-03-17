import { useEffect, useState, useRef, useCallback } from "react";
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Divider, IconButton, InputAdornment, MenuItem, CircularProgress,
  Switch, TextField, Typography,
} from "@mui/material";
import { Close, Save, Edit, InfoOutlined, LocationOn } from "@mui/icons-material";

/* ── API helpers ─────────────────────────────────────────────────────────── */
const BASE = import.meta.env.VITE_API_BASE_URL;
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

/* ── Default empty form ──────────────────────────────────────────────────── */
const EMPTY = {
  firstName: "",
  lastName: "",
  employeeId: "",
  gender: "",
  dateOfBirth: "",
  email: "",
  phone: "",
  dateOfJoining: "",
  employeeStatus: "",
  designation: "",
  department: "",
  reportingManager: "",
  baseLocation: "",
  currentLocation: "",
  workMode: "",
  overallExperience: "",
  relevantExperience: "",
  homeTown: "",
  passportAvailable: false,
  passportNumber: "",
  panNumber: "",
  aadhaarNumber: "",
  bankAccount: "",
  ifscCode: "",
  remarks: "",
};

const GENDER_OPTIONS    = ["Male", "Female", "Other"];
const STATUS_OPTIONS    = ["Active", "Notice", "Exited"];
const WORK_MODE_OPTIONS = ["WFH", "WFO", "Hybrid"];

/* ── Live Location Autocomplete ──────────────────────────────────────────── */
function LocationAutocomplete({ label, value, onChange, sx }) {
  const [inputValue, setInputValue] = useState(value || "");
  const [options, setOptions]       = useState([]);
  const [loading, setLoading]       = useState(false);
  const [open, setOpen]             = useState(false);
  const debounceRef                 = useRef(null);

  useEffect(() => { setInputValue(value || ""); }, [value]);

  const fetchSuggestions = useCallback(async (query) => {
    if (!query || query.length < 2) { setOptions([]); return; }
    setLoading(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=10&countrycodes=in`;
      const res = await fetch(url, {
        headers: { "Accept-Language": "en", "User-Agent": "EmployeeTracker/1.0" },
      });
      const data = await res.json();
      const seen = new Set();
      const places = data
        .map((item) => {
          const a = item.address || {};
          const city  = a.city || a.town || a.municipality || a.village || a.suburb || a.county || a.district || item.name;
          const state = a.state || "";
          const label = state ? `${city}, ${state}` : city;
          return { label, city };
        })
        .filter(({ label }) => {
          if (!label || seen.has(label)) return false;
          seen.add(label);
          return true;
        });
      setOptions(places);
    } catch {
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInput = (e) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 400);
    setOpen(val.length >= 2);
  };

  const handleSelect = (place) => {
    setInputValue(place.label);
    onChange(place.label);
    setOptions([]);
    setOpen(false);
  };

  return (
    <Box sx={{ position: "relative" }}>
      <TextField
        fullWidth size="small" label={label}
        value={inputValue}
        onChange={handleInput}
        onFocus={() => inputValue.length >= 2 && options.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 180)}
        autoComplete="off"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocationOn sx={{ fontSize: 16, color: "#8faabf" }} />
            </InputAdornment>
          ),
          endAdornment: loading ? (
            <InputAdornment position="end">
              <CircularProgress size={14} sx={{ color: "#1a3c6e" }} />
            </InputAdornment>
          ) : null,
        }}
        sx={sx}
      />
      {open && options.length > 0 && (
        <Box sx={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          bgcolor: "#fff", borderRadius: "8px", zIndex: 9999,
          boxShadow: "0 8px 24px rgba(26,60,110,0.14)",
          border: "1px solid #d0dcea",
          maxHeight: 220, overflowY: "auto",
        }}>
          {options.map((place, i) => (
            <Box key={i} onMouseDown={() => handleSelect(place)}
              sx={{
                px: 2, py: 1.2, cursor: "pointer", fontSize: "0.855rem",
                display: "flex", alignItems: "center", gap: 1.2, color: "#1a2740",
                "&:hover": { bgcolor: "#f0f5fb" },
                borderBottom: i < options.length - 1 ? "1px solid #f0f4f8" : "none",
              }}>
              <LocationOn sx={{ fontSize: 14, color: "#8faabf", flexShrink: 0 }} />
              {place.label}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

/* ── Field styles ────────────────────────────────────────────────────────── */
const fsx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px", fontSize: "0.875rem", bgcolor: "#ffffff",
    boxShadow: "0 1px 4px rgba(26,60,110,0.08)",
    "& fieldset": { borderColor: "#c5d4e8" },
    "&:hover fieldset": { borderColor: "#1a3c6e" },
    "&.Mui-focused fieldset": { borderColor: "#1a3c6e", borderWidth: "2px" },
    "&.Mui-error fieldset": { borderColor: "#d32f2f" },
  },
  "& .MuiInputLabel-root": { color: "#6b7e99", fontSize: "0.875rem" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#1a3c6e" },
  "& .MuiInputLabel-root.Mui-error":   { color: "#d32f2f" },
  "& .MuiFormHelperText-root": { mx: 0, mt: "4px", fontSize: "0.72rem" },
};

const acSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px", fontSize: "0.875rem", bgcolor: "#ffffff",
    boxShadow: "0 1px 4px rgba(26,60,110,0.08)",
    "& fieldset": { borderColor: "#c5d4e8" },
    "&:hover fieldset": { borderColor: "#1a3c6e" },
    "&.Mui-focused fieldset": { borderColor: "#1a3c6e", borderWidth: "2px" },
  },
  "& .MuiInputLabel-root": { color: "#6b7e99", fontSize: "0.875rem" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#1a3c6e" },
};

/* ── Layout helpers ──────────────────────────────────────────────────────── */
const Row   = ({ children, gap = 2, mb = 2 }) => (
  <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap, mb }}>{children}</Box>
);
const Field = ({ children }) => <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>;

/* ── Section heading ─────────────────────────────────────────────────────── */
const SectionLabel = ({ children }) => (
  <Box sx={{ mb: 2, mt: 1 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box sx={{ width: 3, height: 14, bgcolor: "#1a3c6e", borderRadius: 4 }} />
      <Typography sx={{ fontSize: "0.68rem", fontWeight: 800, color: "#1a3c6e", letterSpacing: 1.6, textTransform: "uppercase" }}>
        {children}
      </Typography>
    </Box>
    <Divider sx={{ mt: 0.75, borderColor: "#d8e6f5" }} />
  </Box>
);

/* ── Hint helper ─────────────────────────────────────────────────────────── */
const Hint = ({ text, error }) =>
  error ? null : (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.4, mt: "4px" }}>
      <InfoOutlined sx={{ fontSize: 11, color: "#8faabf" }} />
      <Typography sx={{ fontSize: "0.7rem", color: "#8faabf", lineHeight: 1 }}>{text}</Typography>
    </Box>
  );

/* ── Blocked char snackbar ───────────────────────────────────────────────── */
const BlockedHint = ({ field }) =>
  field ? (
    <Box sx={{
      position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)",
      bgcolor: "#1a2740", color: "#fff", px: 2.5, py: 1, borderRadius: 2,
      fontSize: "0.78rem", fontWeight: 500, zIndex: 9999,
      boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
      display: "flex", alignItems: "center", gap: 1,
      animation: "fadeInUp 0.2s ease",
      "@keyframes fadeInUp": {
        from: { opacity: 0, transform: "translateX(-50%) translateY(8px)" },
        to:   { opacity: 1, transform: "translateX(-50%) translateY(0)" },
      },
    }}>
      <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#f97316" }} />
      Only {field} allowed in this field
    </Box>
  ) : null;

/* ── Toggle Card ─────────────────────────────────────────────────────────── */
const ToggleCard = ({ label, description, checked, onChange }) => (
  <Box sx={{
    border: "1px solid #c5d4e8", borderRadius: "8px", px: 2, py: 1.5,
    bgcolor: "#ffffff", boxShadow: "0 1px 4px rgba(26,60,110,0.08)",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    transition: "border-color 0.2s, box-shadow 0.2s",
    "&:hover": { borderColor: "#1a3c6e", boxShadow: "0 2px 8px rgba(26,60,110,0.12)" },
  }}>
    <Box>
      <Typography variant="body2" fontWeight={600} color="#1a2740" fontSize="0.85rem">{label}</Typography>
      <Typography variant="caption" color="#8faabf" fontSize="0.75rem">{description}</Typography>
    </Box>
    <Switch checked={checked} onChange={onChange} size="small"
      sx={{
        "& .MuiSwitch-switchBase.Mui-checked": { color: "#1a3c6e" },
        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#1a3c6e" },
      }} />
  </Box>
);

/* ── Validators ──────────────────────────────────────────────────────────── */
const isValidEmail   = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isValidPhone   = (v) => !v || /^[+\d\s\-()]{7,15}$/.test(v);
const isValidPAN     = (v) => !v || /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v.toUpperCase());
const isValidAadhaar = (v) => !v || /^\d{12}$/.test(v.replace(/\s/g, ""));
const isValidIFSC    = (v) => !v || /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v.toUpperCase());

/* ════════════════════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════════════════════ */
export default function EmployeeFormModal({ open, onClose, onSave, editData }) {
  const [form,    setForm]    = useState(EMPTY);
  const [errors,  setErrors]  = useState({});
  const [blocked, setBlocked] = useState("");

  /* ── DDL state ───────────────────────────────────────────────────────── */
  const [designations, setDesignations] = useState([]);  // [{ _id, designationName }]
  const [managers,     setManagers]     = useState([]);  // [{ _id, fullName }]
  const [ddlLoading,   setDdlLoading]   = useState(false);

  /* ── Fetch DDLs on mount ─────────────────────────────────────────────── */
  useEffect(() => {
    const fetchDDLs = async () => {
      setDdlLoading(true);
      try {
        const [desRes, mgrRes] = await Promise.all([
          fetch(`${BASE}/api/ddls/designations`, { headers: authHeaders() }),
          fetch(`${BASE}/api/ddls/employees`,    { headers: authHeaders() }),
        ]);
        const desJson = await desRes.json();
        const mgrJson = await mgrRes.json();
        setDesignations(Array.isArray(desJson.data) ? desJson.data : []);
        setManagers(Array.isArray(mgrJson.data)     ? mgrJson.data : []);
      } catch {
        setDesignations([]);
        setManagers([]);
      } finally {
        setDdlLoading(false);
      }
    };
    fetchDDLs();
  }, []);

  /* ── Sync form with editData ─────────────────────────────────────────── */
  useEffect(() => {
    if (editData) {
      setForm({
        ...EMPTY,
        ...editData,
        // For edit mode, store the _id so the dropdown pre-selects correctly
        designation:      editData.designationId?._id      || editData.designationId      || editData.designation      || "",
        reportingManager: editData.reportingManagerId?._id || editData.reportingManagerId || editData.reportingManager || "",
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
    setBlocked("");
  }, [editData, open]);

  /* ── Blocked char flash ──────────────────────────────────────────────── */
  const flashBlocked = (label) => {
    setBlocked(label);
    setTimeout(() => setBlocked(""), 1800);
  };

  const set = (name, value) => {
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "phone") {
      const clean = value.replace(/[^\d+\-\s()]/g, "");
      if (clean !== value) flashBlocked("digits, +, - and spaces");
      set(name, clean); return;
    }
    if (name === "overallExperience" || name === "relevantExperience") {
      const clean = value.replace(/[^\d.]/g, "");
      if (clean !== value) flashBlocked("numbers");
      set(name, clean); return;
    }
    if (name === "aadhaarNumber") {
      const clean = value.replace(/\D/g, "").slice(0, 12);
      if (clean !== value.slice(0, 12)) flashBlocked("digits");
      set(name, clean); return;
    }
    if (name === "bankAccount") {
      const clean = value.replace(/\D/g, "");
      if (clean !== value) flashBlocked("digits");
      set(name, clean); return;
    }
    if (name === "panNumber") {
      const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
      if (clean !== value.toUpperCase().slice(0, 10)) flashBlocked("letters and digits");
      set(name, clean); return;
    }
    if (name === "ifscCode") {
      const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 11);
      if (clean !== value.toUpperCase().slice(0, 11)) flashBlocked("letters and digits");
      set(name, clean); return;
    }

    set(name, type === "checkbox" ? checked : value);
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim())   e.firstName      = "First name is required";
    if (!form.lastName.trim())    e.lastName       = "Last name is required";
    if (!form.email.trim())       e.email          = "Email is required";
    else if (!isValidEmail(form.email)) e.email    = "Enter a valid email address";
    if (form.phone && !isValidPhone(form.phone))              e.phone          = "Enter a valid phone number";
    if (!form.designation)                                    e.designation    = "Designation is required";
    if (!form.dateOfJoining)                                  e.dateOfJoining  = "Date of joining is required";
    if (!form.employeeStatus)                                 e.employeeStatus = "Status is required";
    if (form.panNumber     && !isValidPAN(form.panNumber))    e.panNumber      = "Invalid PAN (e.g. ABCDE1234F)";
    if (form.aadhaarNumber && !isValidAadhaar(form.aadhaarNumber)) e.aadhaarNumber = "Aadhaar must be 12 digits";
    if (form.ifscCode      && !isValidIFSC(form.ifscCode))    e.ifscCode       = "Invalid IFSC (e.g. SBIN0001234)";
    return e;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      const el = document.querySelector(`[name="${Object.keys(errs)[0]}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    onSave({ ...form });
    onClose();
  };

  /* ── Progress ────────────────────────────────────────────────────────── */
  const required = ["firstName", "lastName", "email", "designation", "dateOfJoining", "employeeStatus"];
  const filled   = required.filter((k) => form[k]?.toString().trim()).length;
  const progress = Math.round((filled / required.length) * 100);

  /* ── Helpers to get display name from selected _id ───────────────────── */
  const selectedDesignationName = designations.find((d) => d._id === form.designation)?.designationName || "";
  const selectedManagerName     = managers.find((m) => m._id === form.reportingManager)?.fullName || "";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: "12px", m: 2,
          height: "calc(100vh - 48px)", maxHeight: "calc(100vh - 48px)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          boxShadow: "0 32px 80px rgba(26,60,110,0.22)",
        },
      }}>

      {/* ── HEADER ────────────────────────────────────────────────────── */}
      <DialogTitle sx={{
        background: "linear-gradient(135deg, #1a3c6e 0%, #1e4d8c 100%)",
        color: "#fff", px: 3, py: 2, flexShrink: 0,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ width: 4, height: 26, bgcolor: "#5baeff", borderRadius: 4 }} />
          <Box>
            <Typography fontWeight={700} fontSize="1rem" letterSpacing={0.3}>
              {editData ? "Edit Employee" : "Add New Employee"}
            </Typography>
            <Typography fontSize="0.72rem" sx={{ color: "rgba(255,255,255,0.55)", mt: 0.1 }}>
              {editData ? `Editing: ${editData.firstName} ${editData.lastName}` : "Fill in the details below"}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 80, height: 4, bgcolor: "rgba(255,255,255,0.2)", borderRadius: 4, overflow: "hidden" }}>
              <Box sx={{ width: `${progress}%`, height: "100%", bgcolor: progress === 100 ? "#4ade80" : "#5baeff", borderRadius: 4, transition: "width 0.3s ease" }} />
            </Box>
            <Typography fontSize="0.7rem" sx={{ color: "rgba(255,255,255,0.65)" }}>{filled}/{required.length}</Typography>
          </Box>
          <IconButton onClick={onClose} size="small"
            sx={{ color: "rgba(255,255,255,0.7)", "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.12)" } }}>
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* ── CONTENT ───────────────────────────────────────────────────── */}
      <DialogContent sx={{ flexGrow: 1, overflowY: "auto", bgcolor: "#eef2f8", p: 3 }}>

        {/* Basic Information */}
        <SectionLabel>Basic Information</SectionLabel>
        <Row>
          <Field>
            <TextField fullWidth size="small" name="firstName" label="First Name *"
              value={form.firstName} onChange={handleChange}
              error={!!errors.firstName} helperText={errors.firstName} sx={fsx} />
          </Field>
          <Field>
            <TextField fullWidth size="small" name="lastName" label="Last Name *"
              value={form.lastName} onChange={handleChange}
              error={!!errors.lastName} helperText={errors.lastName} sx={fsx} />
          </Field>
        </Row>

        <Row>
          <Field>
            <TextField fullWidth size="small" select name="gender" label="Gender"
              value={form.gender} onChange={handleChange} sx={fsx}>
              {GENDER_OPTIONS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </TextField>
          </Field>
          <Field>
            <TextField fullWidth size="small" type="date" name="dateOfBirth" label="Date of Birth"
              value={form.dateOfBirth} onChange={handleChange}
              InputLabelProps={{ shrink: true }} sx={fsx} />
          </Field>
          <Field>
            <TextField fullWidth size="small" name="email" label="Email *" type="email"
              value={form.email} onChange={handleChange}
              error={!!errors.email} helperText={errors.email} sx={fsx} />
          </Field>
        </Row>

        <Row>
          <Field>
            <TextField fullWidth size="small" name="phone" label="Phone"
              value={form.phone} onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone || <Hint text="Digits, +, − and spaces only" />}
              inputProps={{ maxLength: 15 }} sx={fsx} />
          </Field>
          <Field>
            <LocationAutocomplete label="Home Town" value={form.homeTown}
              onChange={(v) => set("homeTown", v)} sx={acSx} />
          </Field>
        </Row>

        {/* Employment Details */}
        <SectionLabel>Employment Details</SectionLabel>
        <Row>
          <Field>
            <TextField fullWidth size="small" type="date" name="dateOfJoining" label="Date of Joining *"
              value={form.dateOfJoining} onChange={handleChange}
              error={!!errors.dateOfJoining} helperText={errors.dateOfJoining}
              InputLabelProps={{ shrink: true }} sx={fsx} />
          </Field>
          <Field>
            <TextField fullWidth size="small" select name="employeeStatus" label="Employee Status *"
              value={form.employeeStatus} onChange={handleChange}
              error={!!errors.employeeStatus} helperText={errors.employeeStatus} sx={fsx}>
              {STATUS_OPTIONS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </TextField>
          </Field>
        </Row>

        <Row>
          <Field>
            <TextField fullWidth size="small" name="relevantExperience" label="Relevant Experience (Yrs)"
              value={form.relevantExperience} onChange={handleChange}
              inputProps={{ inputMode: "decimal" }}
              helperText={<Hint text="Numbers only" />} sx={fsx} />
          </Field>
          <Field>
            <TextField fullWidth size="small" name="overallExperience" label="Overall Experience (Yrs)"
              value={form.overallExperience} onChange={handleChange}
              inputProps={{ inputMode: "decimal" }}
              helperText={<Hint text="Numbers only" />} sx={fsx} />
          </Field>
        </Row>

        {/* Organization Details */}
        <SectionLabel>Organization Details</SectionLabel>
        <Row>
          {/* Designation — live from API */}
          <Field>
            <TextField fullWidth size="small" select name="designation" label="Designation *"
              value={form.designation} onChange={handleChange}
              error={!!errors.designation} helperText={errors.designation}
              disabled={ddlLoading}
              InputProps={ddlLoading ? {
                endAdornment: <InputAdornment position="end"><CircularProgress size={14} sx={{ color: "#1a3c6e" }} /></InputAdornment>,
              } : undefined}
              sx={fsx}>
              {designations.length === 0 && !ddlLoading && (
                <MenuItem disabled value=""><em>No designations found</em></MenuItem>
              )}
              {designations.map((d) => (
                <MenuItem key={d._id} value={d._id}>{d.designationName}</MenuItem>
              ))}
            </TextField>
          </Field>

          {/* Reporting Manager — live from API */}
          <Field>
            <TextField fullWidth size="small" select name="reportingManager" label="Reporting Manager"
              value={form.reportingManager} onChange={handleChange}
              disabled={ddlLoading}
              InputProps={ddlLoading ? {
                endAdornment: <InputAdornment position="end"><CircularProgress size={14} sx={{ color: "#1a3c6e" }} /></InputAdornment>,
              } : undefined}
              sx={fsx}>
              <MenuItem value=""><em>None</em></MenuItem>
              {managers.map((m) => (
                <MenuItem key={m._id} value={m._id}>{m.fullName}</MenuItem>
              ))}
            </TextField>
          </Field>
        </Row>

        <Row>
          <Field>
            <LocationAutocomplete label="Base Location" value={form.baseLocation}
              onChange={(v) => set("baseLocation", v)} sx={acSx} />
          </Field>
          <Field>
            <LocationAutocomplete label="Current Location" value={form.currentLocation}
              onChange={(v) => set("currentLocation", v)} sx={acSx} />
          </Field>
          <Field>
            <TextField fullWidth size="small" select name="workMode" label="Work Mode"
              value={form.workMode} onChange={handleChange} sx={fsx}>
              {WORK_MODE_OPTIONS.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </TextField>
          </Field>
        </Row>

        {/* Additional Details */}
        <SectionLabel>Additional Details</SectionLabel>
        <Row mb={2}>
          <Field>
            <ToggleCard
              label="Passport Available"
              description="Employee holds a valid passport"
              checked={form.passportAvailable}
              onChange={(e) => set("passportAvailable", e.target.checked)}
            />
          </Field>
          <Field /><Field />
        </Row>

        {form.passportAvailable && (
          <Row>
            <Field>
              <TextField fullWidth size="small" name="passportNumber" label="Passport Number"
                value={form.passportNumber} onChange={handleChange} sx={fsx} />
            </Field>
            <Field /><Field />
          </Row>
        )}

        <Row>
          <Field>
            <TextField fullWidth size="small" name="panNumber" label="PAN Number"
              value={form.panNumber} onChange={handleChange}
              error={!!errors.panNumber}
              helperText={errors.panNumber || <Hint text="Format: ABCDE1234F — letters and digits only" />}
              inputProps={{ maxLength: 10 }} sx={fsx} />
          </Field>
          <Field>
            <TextField fullWidth size="small" name="aadhaarNumber" label="Aadhaar Number"
              value={form.aadhaarNumber} onChange={handleChange}
              error={!!errors.aadhaarNumber}
              helperText={errors.aadhaarNumber || <Hint text="12 digits only" />}
              inputProps={{ maxLength: 12, inputMode: "numeric" }} sx={fsx} />
          </Field>
          <Field />
        </Row>

        <Row>
          <Field>
            <TextField fullWidth size="small" name="bankAccount" label="Bank Account Number"
              value={form.bankAccount} onChange={handleChange}
              helperText={<Hint text="Digits only — no spaces or letters" />}
              inputProps={{ inputMode: "numeric" }} sx={fsx} />
          </Field>
          <Field>
            <TextField fullWidth size="small" name="ifscCode" label="IFSC Code"
              value={form.ifscCode} onChange={handleChange}
              error={!!errors.ifscCode}
              helperText={errors.ifscCode || <Hint text="Format: SBIN0001234 — uppercase letters and digits" />}
              inputProps={{ maxLength: 11 }} sx={fsx} />
          </Field>
          <Field />
        </Row>

        <Row mb={3}>
          <Field>
            <TextField fullWidth multiline rows={3} name="remarks" label="Remarks"
              value={form.remarks} onChange={handleChange}
              placeholder="Additional notes or comments…" sx={fsx} />
          </Field>
        </Row>
      </DialogContent>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <DialogActions sx={{
        px: 3, py: 2, bgcolor: "#fff", borderTop: "1px solid #e0eaf5",
        flexShrink: 0, gap: 1, display: "flex", alignItems: "center",
      }}>
        <Typography variant="caption" color="#8faabf" sx={{ mr: "auto", fontSize: "0.72rem" }}>
          * Required fields
        </Typography>
        <Button variant="outlined" onClick={onClose} sx={{
          borderRadius: "8px", textTransform: "none", fontWeight: 600,
          borderColor: "#c5d4e8", color: "#4a6d9c", px: 3,
          "&:hover": { bgcolor: "#f0f5fb", borderColor: "#1a3c6e", color: "#1a3c6e" },
        }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}
          startIcon={editData
            ? <Edit sx={{ fontSize: "15px !important" }} />
            : <Save sx={{ fontSize: "15px !important" }} />}
          sx={{
            borderRadius: "8px", textTransform: "none", fontWeight: 700,
            bgcolor: "#1a3c6e", px: 4,
            boxShadow: "0 4px 14px rgba(26,60,110,0.28)",
            "&:hover": { bgcolor: "#15305a", boxShadow: "0 6px 18px rgba(26,60,110,0.35)" },
          }}>
          {editData ? "Update Employee" : "Save Employee"}
        </Button>
      </DialogActions>

      <BlockedHint field={blocked} />
    </Dialog>
  );
}