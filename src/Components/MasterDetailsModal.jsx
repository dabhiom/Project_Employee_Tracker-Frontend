import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Slide,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Close, Edit } from "@mui/icons-material";
import { forwardRef } from "react";

/* ── Slide-up transition ─────────────────────────────────────────────────── */
const SlideUp = forwardRef(function SlideUp(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/* ── Section heading ────────────────────────────────────────────────────── */
export const Section = ({ title }) => (
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
export const DetailItem = ({ icon: Icon, label, value }) => (
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
      transition: "border-color 0.2s",
      "&:hover": { borderColor: "#b3cce8" },
    }}
  >
    {Icon && (
      <Icon sx={{ fontSize: 18, color: "#1a3c6e", mt: 0.2, flexShrink: 0 }} />
    )}
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={600}
        textTransform="uppercase"
        letterSpacing={0.8}
      >
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500} color="#1a1a2e" mt={0.2}>
        {value || "—"}
      </Typography>
    </Box>
  </Box>
);

/* ── Two-column container ───────────────────────────────────────────────── */
export const TwoCol = ({ children }) => (
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
export default function MasterDetailsModal({
  open,
  onClose,
  title,
  children,
  onEdit,
  editLabel = "Edit",
  maxWidth = "md",
}) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
      fullScreen={isXs}
      TransitionComponent={SlideUp}
      PaperProps={{
        sx: {
          borderRadius: isXs ? 0 : 3,
          m: isXs ? 0 : 2,
          maxHeight: isXs ? "100%" : "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      {/* ── Fixed Header ─────────────────────────────────────────────── */}
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
        <Typography fontWeight={700} fontSize="1.05rem">
          {title}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "#fff",
            "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
          }}
        >
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* ── Scrollable Content ───────────────────────────────────────── */}
      <DialogContent
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          bgcolor: "#f4f7fb",
          p: 3,
        }}
      >
        {children}
      </DialogContent>

      {/* ── Fixed Footer ─────────────────────────────────────────────── */}
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
        {onEdit && (
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={onEdit}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              bgcolor: "#1a3c6e",
              px: 3,
              "&:hover": { bgcolor: "#15305a" },
            }}
          >
            {editLabel}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
