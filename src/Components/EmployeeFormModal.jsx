import { useEffect, useState } from "react";
import {
  Autocomplete,
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

/* ── Dropdown options ─────────────────────────────────────────────────── */
const GENDER_OPTIONS = ["Male", "Female", "Other"];
const STATUS_OPTIONS = ["Active", "Notice", "Exited"];
const WORK_MODE_OPTIONS = ["WFH", "WFO", "Hybrid"];
const DESIGNATION_OPTIONS = [
  "Developer",
  "Manager",
  "Analyst",
  "Designer",
  "Team Lead",
  "Senior Developer",
];
const MANAGER_OPTIONS = [
  "Rahul Sharma",
  "Ankit Joshi",
  "Deepak Nair",
  "Priya Mehta",
  "Sneha Patel",
];
const LOCATION_OPTIONS = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Kolkata",
];

/* ── Shared field style ─────────────────────────────────────────────────── */
const fsx = {
  bgcolor: "#fff",
  borderRadius: 2,
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    "&:hover fieldset": { borderColor: "#1a3c6e" },
    "&.Mui-focused fieldset": { borderColor: "#1a3c6e" },
  },
  "& label.Mui-focused": { color: "#1a3c6e" },
};

/* ── Row component for responsive flex layout ──────────────────────────── */
const Row = ({ children, gap = 2, mb = 2 }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      gap,
      mb,
    }}
  >
    {children}
  </Box>
);

/* ── Field wrapper for consistent sizing ────────────────────────────────── */
const Field = ({ children, fullWidth = true }) => (
  <Box sx={{ flex: fullWidth ? 1 : "auto", minWidth: 0 }}>{children}</Box>
);

/* ── Toggle Card Component ──────────────────────────────────────────────── */
const ToggleCard = ({ label, description, checked, onChange }) => (
  <Box
    sx={{
      border: "1px solid #e0e7ef",
      borderRadius: 2,
      px: 2.5,
      py: 1.5,
      bgcolor: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      "&:hover": { bgcolor: "#f9fafc" },
    }}
  >
    <Box>
      <Typography variant="body2" fontWeight={600} color="#1a3c6e">
        {label}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {description}
      </Typography>
    </Box>
    <Switch
      checked={checked}
      onChange={onChange}
      sx={{
        "& .MuiSwitch-switchBase.Mui-checked": { color: "#1a3c6e" },
        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
          bgcolor: "#1a3c6e",
        },
      }}
    />
  </Box>
);

/* ════════════════════════════════════════════════════════════════════════ */
export default function EmployeeFormModal({ open, onClose, onSave, editData }) {
  const [form, setForm] = useState(EMPTY);
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

  const handleLocationChange = (fieldName, value) => {
    set(fieldName, value || "");
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.employeeId.trim()) e.employeeId = "Required";
    if (!form.email.trim()) e.email = "Required";
    if (!form.designation) e.designation = "Required";
    if (!form.dateOfJoining) e.dateOfJoining = "Required";
    if (!form.employeeStatus) e.employeeStatus = "Required";
    return e;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSave(form);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: 3,
          m: 2,
          height: "calc(100vh - 64px)",
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
          {editData ? "✏️  Edit Employee" : "➕  Add Employee"}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: "#fff" }}>
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* ══ SCROLLABLE CONTENT ═════════════════════════════════════════════ */}
      <DialogContent
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          bgcolor: "#f4f7fb",
          p: 3,
        }}
      >
        {/* ─── SECTION 1 : Basic Information ─────────────────────────── */}
        <Typography
          variant="caption"
          fontWeight={700}
          color="#1a3c6e"
          letterSpacing={1.2}
          textTransform="uppercase"
        >
          Basic Information
        </Typography>
        <Divider sx={{ my: 1.5, borderColor: "#dce6f5" }} />

        <Row gap={2} mb={2}>
          <Field>
            <TextField
              fullWidth
              size="small"
              name="firstName"
              label="First Name *"
              value={form.firstName}
              onChange={handleChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
              sx={fsx}
            />
          </Field>
          <Field>
            <TextField
              fullWidth
              size="small"
              name="lastName"
              label="Last Name *"
              value={form.lastName}
              onChange={handleChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
              sx={fsx}
            />
          </Field>
          <Field>
            <TextField
              fullWidth
              size="small"
              name="employeeId"
              label="Employee ID *"
              value={form.employeeId}
              onChange={handleChange}
              error={!!errors.employeeId}
              helperText={errors.employeeId}
              sx={fsx}
            />
          </Field>
        </Row>

        <Row gap={2} mb={2}>
          <Field>
            <TextField
              fullWidth
              size="small"
              select
              name="gender"
              label="Gender"
              value={form.gender}
              onChange={handleChange}
              sx={fsx}
            >
              {GENDER_OPTIONS.map((o) => (
                <MenuItem key={o} value={o}>
                  {o}
                </MenuItem>
              ))}
            </TextField>
          </Field>
          <Field>
            <TextField
              fullWidth
              size="small"
              type="date"
              name="dateOfBirth"
              label="Date of Birth"
              value={form.dateOfBirth}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={fsx}
            />
          </Field>
          <Field>
            <TextField
              fullWidth
              size="small"
              name="email"
              label="Email *"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              sx={fsx}
            />
          </Field>
        </Row>

        <Row gap={2} mb={2}>
          <Field>
            <TextField
              fullWidth
              size="small"
              name="phone"
              label="Phone"
              value={form.phone}
              onChange={handleChange}
              sx={fsx}
            />
          </Field>
          <Field>
            <TextField
              fullWidth
              size="small"
              name="homeTown"
              label="Home Town"
              value={form.homeTown}
              onChange={handleChange}
              sx={fsx}
            />
          </Field>
        </Row>

        {/* ─── SECTION 2 : Employment Details ─────────────────────────── */}
        <Typography
          variant="caption"
          fontWeight={700}
          color="#1a3c6e"
          letterSpacing={1.2}
          textTransform="uppercase"
          sx={{ mt: 2 }}
        >
          Employment Details
        </Typography>
        <Divider sx={{ my: 1.5, borderColor: "#dce6f5" }} />

        <Row gap={2} mb={2}>
          <Field>
            <TextField
              fullWidth
              size="small"
              type="date"
              name="dateOfJoining"
              label="Date of Joining *"
              value={form.dateOfJoining}
              onChange={handleChange}
              error={!!errors.dateOfJoining}
              helperText={errors.dateOfJoining}
              InputLabelProps={{ shrink: true }}
              sx={fsx}
            />
          </Field>
          <Field>
            <TextField
              fullWidth
              size="small"
              select
              name="employeeStatus"
              label="Employee Status *"
              value={form.employeeStatus}
              onChange={handleChange}
              error={!!errors.employeeStatus}
              helperText={errors.employeeStatus}
              sx={fsx}
            >
              {STATUS_OPTIONS.map((o) => (
                <MenuItem key={o} value={o}>
                  {o}
                </MenuItem>
              ))}
            </TextField>
          </Field>
          <Field>
            <TextField
              fullWidth
              size="small"
              name="overallExperience"
              label="Overall Experience (Years)"
              type="number"
              inputProps={{ step: "0.5" }}
              value={form.overallExperience}
              onChange={handleChange}
              sx={fsx}
            />
          </Field>
        </Row>

        <Row gap={2} mb={2}>
          <Field>
            <TextField
              fullWidth
              size="small"
              name="relevantExperience"
              label="Relevant Experience (Years)"
              type="number"
              inputProps={{ step: "0.5" }}
              value={form.relevantExperience}
              onChange={handleChange}
              sx={fsx}
            />
          </Field>
        </Row>

        {/* ─── SECTION 3 : Organization Details ─────────────────────────── */}
        <Typography
          variant="caption"
          fontWeight={700}
          color="#1a3c6e"
          letterSpacing={1.2}
          textTransform="uppercase"
          sx={{ mt: 2 }}
        >
          Organization Details
        </Typography>
        <Divider sx={{ my: 1.5, borderColor: "#dce6f5" }} />

        <Row gap={2} mb={2}>
          <Field>
            <TextField
              fullWidth
              size="small"
              select
              name="designation"
              label="Designation *"
              value={form.designation}
              onChange={handleChange}
              error={!!errors.designation}
              helperText={errors.designation}
              sx={fsx}
            >
              {DESIGNATION_OPTIONS.map((o) => (
                <MenuItem key={o} value={o}>
                  {o}
                </MenuItem>
              ))}
            </TextField>
          </Field>
          <Field>
            <TextField
              fullWidth
              size="small"
              name="department"
              label="Department"
              placeholder="e.g., IT, HR, Finance"
              value={form.department}
              onChange={handleChange}
              sx={fsx}
            />
          </Field>
          <Field>
            <TextField
              fullWidth
              size="small"
              select
              name="reportingManager"
              label="Reporting Manager"
              value={form.reportingManager}
              onChange={handleChange}
              sx={fsx}
            >
              {MANAGER_OPTIONS.map((o) => (
                <MenuItem key={o} value={o}>
                  {o}
                </MenuItem>
              ))}
            </TextField>
          </Field>
        </Row>

        <Row gap={2} mb={2}>
          <Field>
            <Autocomplete
              fullWidth
              size="small"
              options={LOCATION_OPTIONS}
              value={form.baseLocation}
              onChange={(e, value) =>
                handleLocationChange("baseLocation", value)
              }
              freeSolo
              renderInput={(params) => (
                <TextField {...params} label="Base Location" sx={fsx} />
              )}
              noOptionsText="Type or select a location"
            />
          </Field>
          <Field>
            <Autocomplete
              fullWidth
              size="small"
              options={LOCATION_OPTIONS}
              value={form.currentLocation}
              onChange={(e, value) =>
                handleLocationChange("currentLocation", value)
              }
              freeSolo
              renderInput={(params) => (
                <TextField {...params} label="Current Location" sx={fsx} />
              )}
              noOptionsText="Type or select a location"
            />
          </Field>
          <Field>
            <TextField
              fullWidth
              size="small"
              select
              name="workMode"
              label="Work Mode"
              value={form.workMode}
              onChange={handleChange}
              sx={fsx}
            >
              {WORK_MODE_OPTIONS.map((o) => (
                <MenuItem key={o} value={o}>
                  {o}
                </MenuItem>
              ))}
            </TextField>
          </Field>
        </Row>

        {/* ─── SECTION 4 : Additional Details ─────────────────────────── */}
        <Typography
          variant="caption"
          fontWeight={700}
          color="#1a3c6e"
          letterSpacing={1.2}
          textTransform="uppercase"
          sx={{ mt: 2 }}
        >
          Additional Details
        </Typography>
        <Divider sx={{ my: 1.5, borderColor: "#dce6f5" }} />

        <Row gap={2} mb={2}>
          <Field fullWidth={true}>
            <ToggleCard
              label="Passport Available"
              description="Check if employee has a valid passport"
              checked={form.passportAvailable}
              onChange={(e) => set("passportAvailable", e.target.checked)}
            />
          </Field>
        </Row>

        {form.passportAvailable && (
          <Row gap={2} mb={2}>
            <Field>
              <TextField
                fullWidth
                name="passportNumber"
                label="Passport Number"
                value={form.passportNumber}
                onChange={handleChange}
                sx={fsx}
              />
            </Field>
          </Row>
        )}

        <Row gap={2} mb={2}>
          <Field>
            <TextField
              fullWidth
              name="panNumber"
              label="PAN Number"
              value={form.panNumber}
              onChange={handleChange}
              sx={fsx}
            />
          </Field>
          <Field>
            <TextField
              fullWidth
              name="aadhaarNumber"
              label="Aadhaar Number"
              value={form.aadhaarNumber}
              onChange={handleChange}
              sx={fsx}
            />
          </Field>
        </Row>

        <Row gap={2} mb={2}>
          <Field>
            <TextField
              fullWidth
              name="bankAccount"
              label="Bank Account Number"
              value={form.bankAccount}
              onChange={handleChange}
              sx={fsx}
            />
          </Field>
          <Field>
            <TextField
              fullWidth
              name="ifscCode"
              label="IFSC Code"
              value={form.ifscCode}
              onChange={handleChange}
              sx={fsx}
            />
          </Field>
        </Row>

        <Row gap={2} mb={3}>
          <Field fullWidth={true}>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="remarks"
              label="Remarks"
              value={form.remarks}
              onChange={handleChange}
              placeholder="Add any additional notes or comments..."
              sx={fsx}
            />
          </Field>
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
          {editData ? "Update Employee" : "Save Employee"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
