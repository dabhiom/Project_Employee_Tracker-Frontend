import {
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Delete, Edit, Visibility } from "@mui/icons-material";

/* ═══════════════════════════════════════════════════════════════════════════ */
/**
 * MobileCard – Responsive card for a single record on mobile/tablet
 *
 * Props:
 *  title    – string   (primary label, e.g. name)
 *  subtitle – string   (optional secondary label)
 *  fields   – array of { label: string, value: string }
 *  onView   – fn() | undefined  (if omitted, View button hidden)
 *  onEdit   – fn()
 *  onDelete – fn()
 *  index    – number   (row number shown as badge)
 */
export default function MobileCard({
  title,
  subtitle,
  fields = [],
  onView,
  onEdit,
  onDelete,
  index,
}) {
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid #e0e9f5",
        borderRadius: 3,
        mb: 2,
        overflow: "visible",
        transition: "box-shadow 0.2s ease",
        "&:hover": {
          boxShadow: "0 4px 20px rgba(26,60,110,0.12)",
          borderColor: "#b3cce8",
        },
      }}
    >
      <CardContent sx={{ p: "16px !important" }}>
        {/* ── Header row ─────────────────────────────────────────────── */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 1.5,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Row number badge + title */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.25 }}>
              {index !== undefined && (
                <Box
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    bgcolor: "#1a3c6e",
                    color: "#fff",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {index}
                </Box>
              )}
              <Typography
                fontWeight={700}
                fontSize="0.95rem"
                color="#1a1a2e"
                noWrap
              >
                {title || "—"}
              </Typography>
            </Box>

            {/* Subtitle */}
            {subtitle && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", ml: index !== undefined ? "30px" : 0 }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          {/* ── Action buttons ──────────────────────────────────────── */}
          <Box sx={{ display: "flex", gap: 0.25, flexShrink: 0, ml: 1 }}>
            {onView && (
              <Tooltip title="View">
                <IconButton
                  size="small"
                  onClick={onView}
                  sx={{
                    color: "#4caf50",
                    "&:hover": { bgcolor: "#e8f5e9" },
                  }}
                >
                  <Visibility fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={onEdit}
                sx={{
                  color: "#2196f3",
                  "&:hover": { bgcolor: "#e3f2fd" },
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={onDelete}
                sx={{
                  color: "#f44336",
                  "&:hover": { bgcolor: "#ffebee" },
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* ── Field list ─────────────────────────────────────────────── */}
        {fields.length > 0 && (
          <>
            <Divider sx={{ mb: 1.5, borderColor: "#edf2f9" }} />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: fields.length > 1 ? "1fr 1fr" : "1fr",
                gap: "6px 12px",
              }}
            >
              {fields.map((f, i) => (
                <Box key={i}>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    color="text.secondary"
                    textTransform="uppercase"
                    letterSpacing={0.7}
                    display="block"
                  >
                    {f.label}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="#1a1a2e"
                    fontWeight={500}
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {f.value || "—"}
                  </Typography>
                </Box>
              ))}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}
