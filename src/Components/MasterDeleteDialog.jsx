import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Slide,
  Typography,
} from "@mui/material";
import { DeleteForever, WarningAmberRounded } from "@mui/icons-material";
import { forwardRef } from "react";

const SlideUp = forwardRef(function SlideUp(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MasterDeleteDialog({
  open,
  onClose,
  onConfirm,
  itemName = "record",
}) {
  const label = itemName.charAt(0).toUpperCase() + itemName.slice(1);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      TransitionComponent={SlideUp}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(26,60,110,0.14)",
        },
      }}
    >
      {/* ── Content ───────────────────────────────────────────────────── */}
      <DialogContent sx={{ px: 4, pt: 4.5, pb: 2.5, bgcolor: "#fff", textAlign: "center" }}>

        {/* Soft warning icon */}
        <Box sx={{
          width: 60, height: 60, borderRadius: "50%",
          bgcolor: "#fef2f2", border: "1.5px solid #fecaca",
          display: "flex", alignItems: "center", justifyContent: "center",
          mx: "auto", mb: 2.5,
        }}>
          <WarningAmberRounded sx={{ color: "#ef4444", fontSize: 30 }} />
        </Box>

        <Typography fontWeight={700} fontSize="1rem" color="#1a2740" mb={1}>
          Delete {label}?
        </Typography>

        <Typography variant="body2" color="#6b7e99" lineHeight={1.75} fontSize="0.875rem">
          Are you sure you want to delete this{" "}
          <Box component="span" sx={{ color: "#1a2740", fontWeight: 600 }}>{itemName}</Box>?
          {" "}This action cannot be undone.
        </Typography>

      </DialogContent>

      {/* ── Actions ───────────────────────────────────────────────────── */}
      <DialogActions sx={{ px: 4, pb: 4, pt: 1, bgcolor: "#fff", gap: 1.5, display: "flex" }}>
        <Button
          variant="outlined"
          onClick={onClose}
          fullWidth
          sx={{
            borderRadius: "8px", textTransform: "none", fontWeight: 600,
            borderColor: "#d0dcea", color: "#4a6d9c", py: 1,
            "&:hover": { bgcolor: "#f0f5fb", borderColor: "#1a3c6e", color: "#1a3c6e" },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<DeleteForever sx={{ fontSize: "17px !important" }} />}
          onClick={onConfirm}
          fullWidth
          sx={{
            borderRadius: "8px", textTransform: "none", fontWeight: 700,
            bgcolor: "#ef4444", py: 1,
            boxShadow: "0 4px 12px rgba(239,68,68,0.2)",
            "&:hover": { bgcolor: "#dc2626", boxShadow: "0 6px 16px rgba(239,68,68,0.28)" },
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}