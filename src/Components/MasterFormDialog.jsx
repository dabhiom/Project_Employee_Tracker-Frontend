import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Slide,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Close, Save } from "@mui/icons-material";
import { forwardRef } from "react";

/* ── Slide-up transition ─────────────────────────────────────────────────── */
const SlideUp = forwardRef(function SlideUp(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/* ═══════════════════════════════════════════════════════════════════════════ */
/**
 * MasterFormDialog – Reusable styled form dialog
 *
 * Props:
 *  open       – boolean
 *  onClose    – fn()
 *  title      – string  (dialog header title)
 *  onSave     – fn()    (called on Save button click)
 *  saveLabel  – string  (default "Save")
 *  children   – form fields rendered inside
 */
export default function MasterFormDialog({
  open,
  onClose,
  title,
  onSave,
  saveLabel = "Save",
  children,
}) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isXs}
      TransitionComponent={SlideUp}
      PaperProps={{
        sx: {
          borderRadius: isXs ? 0 : 3,
          overflow: "hidden",
        },
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <DialogTitle
        sx={{
          bgcolor: "#1a3c6e",
          color: "#fff",
          px: 3,
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <Typography fontWeight={700} fontSize="1rem">
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

      {/* ── Content ────────────────────────────────────────────────────── */}
      <DialogContent
        sx={{
          bgcolor: "#f4f7fb",
          px: { xs: 2, sm: 3 },
          pt: 3,
          pb: 2,
          overflowY: "auto",
        }}
      >
        <Box sx={{ p: { xs: 0, sm: 1 } }}>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {children}
          </Grid>
        </Box>
      </DialogContent>

      {/* ── Actions ────────────────────────────────────────────────────── */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          bgcolor: "#fff",
          borderTop: "1px solid #e0e7ef",
          gap: 1.5,
          flexShrink: 0,
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
          startIcon={<Save />}
          onClick={onSave}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 700,
            bgcolor: "#1a3c6e",
            px: 3,
            "&:hover": { bgcolor: "#15305a" },
          }}
        >
          {saveLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ── Helper: Full-width field wrapper (spans both columns) ───────────────── */
export { Grid };
export const FullWidthField = ({ children }) => (
  <Grid item xs={12}>{children}</Grid>
);
