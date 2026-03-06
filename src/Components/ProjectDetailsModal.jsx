import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import {
  Close,
  Edit,
  CheckCircleRounded,
  CancelRounded,
  CalendarToday,
  Person,
  Business,
  Category,
  Comment,
  Description,
} from "@mui/icons-material";

/* ── Status / Type chip colours ─────────────────────────────────────────── */
const STATUS_COLOR = { Active: "success", Hold: "warning", Closed: "error" };
const TYPE_COLOR   = { Fixed: "primary",  BOT: "secondary", Support: "info" };

/* ── Section heading ────────────────────────────────────────────────────── */
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

/* ── Single detail row ──────────────────────────────────────────────────── */
const DetailItem = ({ icon: Icon, label, value }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "flex-start",
      gap: 1.5,
      bgcolor: "#fff",
      border: "1px solid #e8eef7",
      borderRadius: 2,
      px: 2,
      py: 1.5,
    }}
  >
    {Icon && (
      <Icon sx={{ fontSize: 18, color: "#1a3c6e", mt: 0.2, flexShrink: 0 }} />
    )}
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={0.8}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500} color="#1a1a2e" mt={0.2}>
        {value || "—"}
      </Typography>
    </Box>
  </Box>
);

/* ── Two-column row ─────────────────────────────────────────────────────── */
const TwoCol = ({ children }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      gap: 2,
      mb: 2,
    }}
  >
    {children}
  </Box>
);

/* ════════════════════════════════════════════════════════════════════════ */
export default function ProjectDetailsModal({ open, onClose, data, onEdit }) {
  if (!data) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          m: 2,
          height: "calc(100vh - 64px)",      /* fixed height → enables scroll */
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
          alignItems: "flex-start",
        }}
      >
        <Box>
          <Typography fontWeight={700} fontSize="1.05rem" mb={0.8}>
            {data.projectName}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip
              label={data.projectType}
              color={TYPE_COLOR[data.projectType] || "default"}
              size="small"
              variant="outlined"
              sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.5)", fontSize: "0.72rem" }}
            />
            <Chip
              label={data.projectStatus}
              color={STATUS_COLOR[data.projectStatus] || "default"}
              size="small"
              sx={{ fontSize: "0.72rem", fontWeight: 700 }}
            />
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: "#fff", mt: -0.5 }}>
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* ══ SCROLLABLE CONTENT ═════════════════════════════════════════════ */}
      <DialogContent
        sx={{
          flexGrow: 1,
          overflowY: "scroll",          /* always scrollable */
          bgcolor: "#f4f7fb",
          p: 3,
        }}
      >

        {/* ─── SECTION 1 : Project Details ───────────────────────────── */}
        <Section title="Project Details" />

        <TwoCol>
          <Box sx={{ flex: 1 }}>
            <DetailItem icon={Business} label="Client" value={data.clientId} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <DetailItem icon={Category} label="Project Type" value={data.projectType} />
          </Box>
        </TwoCol>

        <TwoCol>
          <Box sx={{ flex: 1 }}>
            <DetailItem
              icon={CalendarToday}
              label="Start Date"
              value={data.projectStartDate}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <DetailItem
              icon={CalendarToday}
              label="End Date"
              value={data.projectEndDate || "Not set"}
            />
          </Box>
        </TwoCol>

        <Box sx={{ mb: 2 }}>
          <DetailItem
            icon={CalendarToday}
            label="Created On"
            value={data.createdAt}
          />
        </Box>

        <Divider sx={{ my: 3, borderColor: "#dce6f5" }} />

        {/* ─── SECTION 2 : Team ──────────────────────────────────────── */}
        <Section title="Team" />

        <TwoCol>
          <Box sx={{ flex: 1 }}>
            <DetailItem icon={Person} label="Project Manager" value={data.projectManagerId} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <DetailItem icon={Person} label="Team Lead" value={data.teamLeadId} />
          </Box>
        </TwoCol>

        <Divider sx={{ my: 3, borderColor: "#dce6f5" }} />

        {/* ─── SECTION 3 : Description ───────────────────────────────── */}
        {data.projectDescription && (
          <>
            <Section title="Description" />
            <Box
              sx={{
                bgcolor: "#fff",
                border: "1px solid #e8eef7",
                borderRadius: 2,
                px: 2.5,
                py: 2,
                mb: 3,
                display: "flex",
                gap: 1.5,
                alignItems: "flex-start",
              }}
            >
              <Description sx={{ fontSize: 18, color: "#1a3c6e", mt: 0.2, flexShrink: 0 }} />
              <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
                {data.projectDescription}
              </Typography>
            </Box>
          </>
        )}

        {/* ─── SECTION 4 : Comment ───────────────────────────────────── */}
        {data.projectComment && (
          <>
            <Section title="Comment" />
            <Box
              sx={{
                bgcolor: "#fff8e1",
                border: "1px solid #ffe082",
                borderRadius: 2,
                px: 2.5,
                py: 2,
                mb: 3,
                display: "flex",
                gap: 1.5,
                alignItems: "flex-start",
              }}
            >
              <Comment sx={{ fontSize: 18, color: "#f9a825", mt: 0.2, flexShrink: 0 }} />
              <Typography variant="body2" color="#795548" lineHeight={1.8}>
                {data.projectComment}
              </Typography>
            </Box>
          </>
        )}

        <Divider sx={{ my: 3, borderColor: "#dce6f5" }} />

        {/* ─── SECTION 5 : Settings ──────────────────────────────────── */}
        <Section title="Settings" />

        <TwoCol>
          {/* Client Asset Required */}
          <Box
            sx={{
              flex: 1,
              bgcolor: "#fff",
              border: "1px solid #e8eef7",
              borderRadius: 2,
              px: 2,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            {data.clientAssetRequired ? (
              <CheckCircleRounded sx={{ color: "#2e7d32", fontSize: 22 }} />
            ) : (
              <CancelRounded sx={{ color: "#c62828", fontSize: 22 }} />
            )}
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={0.8}>
                Client Asset Required
              </Typography>
              <Typography variant="body2" fontWeight={600} color={data.clientAssetRequired ? "#2e7d32" : "#c62828"}>
                {data.clientAssetRequired ? "Yes" : "No"}
              </Typography>
            </Box>
          </Box>

          {/* Active Status */}
          <Box
            sx={{
              flex: 1,
              bgcolor: "#fff",
              border: "1px solid #e8eef7",
              borderRadius: 2,
              px: 2,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            {data.status ? (
              <CheckCircleRounded sx={{ color: "#2e7d32", fontSize: 22 }} />
            ) : (
              <CancelRounded sx={{ color: "#c62828", fontSize: 22 }} />
            )}
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={0.8}>
                Active Status
              </Typography>
              <Typography variant="body2" fontWeight={600} color={data.status ? "#2e7d32" : "#c62828"}>
                {data.status ? "Active" : "Inactive"}
              </Typography>
            </Box>
          </Box>
        </TwoCol>

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
          Close
        </Button>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => onEdit(data)}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 700,
            bgcolor: "#1a3c6e",
            px: 3,
            "&:hover": { bgcolor: "#15305a" },
          }}
        >
          Edit Project
        </Button>
      </DialogActions>

    </Dialog>
  );
}
