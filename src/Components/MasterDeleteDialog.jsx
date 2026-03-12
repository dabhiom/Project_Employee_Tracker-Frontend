import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Typography,
} from "@mui/material";
import { DeleteForever, WarningAmberRounded } from "@mui/icons-material";
import { forwardRef } from "react";

/* ── Slide-up transition ─────────────────────────────────────────────────── */
const SlideUp = forwardRef(function SlideUp(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/* ═══════════════════════════════════════════════════════════════════════════ */
/**
 * MasterDeleteDialog – Reusable delete-confirmation dialog
 *
 * Props:
 *  open      – boolean
 *  onClose   – fn()
 *  onConfirm – fn()   (called when user confirms delete)
 *  itemName  – string (e.g. "designation", "customer")
 */
export default function MasterDeleteDialog({
  open,
  onClose,
  onConfirm,
  itemName = "record",
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      TransitionComponent={SlideUp}
      PaperProps={{
        sx: { borderRadius: 3, overflow: "hidden" },
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <DialogTitle
        sx={{
          bgcolor: "#fff",
          px: 3,
          py: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <WarningAmberRounded sx={{ color: "#d32f2f", fontSize: 26 }} />
        <Typography fontWeight={700} fontSize="1rem" color="#d32f2f">
          Confirm Deletion
        </Typography>
      </DialogTitle>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <DialogContent sx={{ px: 3, py: 2, bgcolor: "#fff" }}>
        <Typography variant="body2" color="text.primary" lineHeight={1.6} sx={{ mt: 3 }}>
          Are you sure you want to delete this <strong>{itemName}</strong>?
          This action cannot be undone.
        </Typography>
      </DialogContent>

      {/* ── Actions ────────────────────────────────────────────────────── */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          bgcolor: "#fff",
          gap: 2,
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            borderColor: "#9e9e9e",
            color: "#616161",
            px: 3,
            "&:hover": { bgcolor: "#f5f5f5", borderColor: "#757575" },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteForever />}
          onClick={onConfirm}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 700,
            px: 3,
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
