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

const SlideUp = forwardRef(function SlideUp(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const Section = ({ title }) => (
  <Box sx={{ mb: 2 }}>
    <Typography
      variant="caption"
      fontWeight={700}
      color="#1a3c6e"
      letterSpacing={1.4}
      textTransform="uppercase"
      sx={{ fontSize: "0.68rem" }}
    >
      {title}
    </Typography>
    <Divider sx={{ mt: 0.75, borderColor: "#dce8f5" }} />
  </Box>
);

export const DetailItem = ({ icon: Icon, label, value }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "flex-start",
      gap: 1.5,
      bgcolor: "#fff",
      border: "1px solid #eaf0f8",
      borderRadius: 1.5,           // ← reduced radius on detail items
      px: 2,
      py: 1.5,
      transition: "all 0.18s",
      "&:hover": {
        borderColor: "#1a3c6e",
        boxShadow: "0 2px 8px rgba(26,60,110,0.07)",
      },
    }}
  >
    {Icon && (
      <Icon sx={{ fontSize: 16, color: "#4a7ab5", mt: 0.3, flexShrink: 0 }} />
    )}
    <Box sx={{ minWidth: 0 }}>
      <Typography
        sx={{
          fontSize: "0.65rem",
          fontWeight: 700,
          color: "#8faabf",
          textTransform: "uppercase",
          letterSpacing: 1,
          lineHeight: 1,
          mb: 0.4,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        fontWeight={600}
        color="#1a2740"
        sx={{ wordBreak: "break-word" }}
      >
        {value || "—"}
      </Typography>
    </Box>
  </Box>
);

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

// Attach static sub-components so EmployeesPage can use MasterDetailsModal.DetailItem
MasterDetailsModal.DetailItem = DetailItem;
MasterDetailsModal.Section = Section;

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
          borderRadius: isXs ? 0 : 2,    // ← reduced from 3 → 2
          m: isXs ? 0 : 2,
          maxHeight: isXs ? "100%" : "calc(100vh - 48px)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 24px 64px rgba(26,60,110,0.18)",
        },
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────── */}
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #1a3c6e 0%, #1e4d8c 100%)",
          color: "#fff",
          px: 3,
          py: 2,
          flexShrink: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 4,
              height: 22,
              bgcolor: "#5baeff",
              borderRadius: 2,
            }}
          />
          <Typography fontWeight={700} fontSize="1rem" letterSpacing={0.3}>
            {title}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "rgba(255,255,255,0.75)",
            "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.12)" },
          }}
        >
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <DialogContent
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          bgcolor: "#f4f7fb",
          p: { xs: 2, sm: 3 }
        }}
      >
        {children}
      </DialogContent>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          bgcolor: "#fff",
          borderTop: "1px solid #e8eef7",
          flexShrink: 0,
          gap: 1,
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderRadius: 1.5,
            textTransform: "none",
            fontWeight: 600,
            borderColor: "#c8d8ec",
            color: "#4a6d9c",
            px: 3,
            "&:hover": { bgcolor: "#f0f5fb", borderColor: "#1a3c6e", color: "#1a3c6e" },
          }}
        >
          Close
        </Button>
        {onEdit && (
          <Button
            variant="contained"
            startIcon={<Edit sx={{ fontSize: "16px !important" }} />}
            onClick={onEdit}
            sx={{
              borderRadius: 1.5,
              textTransform: "none",
              fontWeight: 700,
              bgcolor: "#1a3c6e",
              px: 3,
              boxShadow: "0 4px 12px rgba(26,60,110,0.25)",
              "&:hover": { bgcolor: "#15305a", boxShadow: "0 6px 16px rgba(26,60,110,0.3)" },
            }}
          >
            {editLabel}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}