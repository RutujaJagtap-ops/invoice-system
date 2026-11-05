"use client";

import { usePathname } from "next/navigation";
import {
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DashboardIcon from "@mui/icons-material/SpaceDashboardOutlined";
import InvoicesIcon from "@mui/icons-material/ReceiptLongOutlined";
import ClientsIcon from "@mui/icons-material/PeopleAltOutlined";
import NextLink from "@/components/ui/nextLink";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: DashboardIcon },
  { label: "Invoices", href: "/invoices", icon: InvoicesIcon },
  { label: "Clients", href: "/clients", icon: ClientsIcon },
];

const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
const DURATION = "260ms";

const COLORS = {
  text: "#c4cce2",
  textMuted: "#7f89a8",
  textActive: "#ffffff",
  accent: "#4f6df5",
  hoverBg: "rgba(255, 255, 255, 0.07)",
  border: "rgba(255, 255, 255, 0.08)",
};

export default function NavList({ onNavigate, collapsed = false, onToggle }) {
  const pathname = usePathname();

  const toggleLabel = collapsed ? "Expand sidebar" : "Collapse sidebar";
  const ToggleIcon = collapsed ? ChevronRightIcon : ChevronLeftIcon;

  const fadeSx = {
    opacity: collapsed ? 0 : 1,
    maxWidth: collapsed ? 0 : 180,
    overflow: "hidden",
    whiteSpace: "nowrap",
    transition: `opacity 180ms ${EASE}, max-width ${DURATION} ${EASE}`,
  };

  const toggleButton = onToggle && (
    <Tooltip title={toggleLabel} placement="right">
      <IconButton
        onClick={onToggle}
        aria-label={toggleLabel}
        size="small"
        sx={{
          width: 40,
          height: 40,
          color: COLORS.text,
          border: `1px solid ${COLORS.border}`,
          bgcolor: "rgba(255, 255, 255, 0.08)",
          transition: `background-color 140ms ${EASE}, color 140ms ${EASE}`,
          "&:hover": {
            color: COLORS.textActive,
            bgcolor: "rgba(113, 134, 202, 0.12)",
          },
        }}
      >
        <ToggleIcon fontSize="medium" />
      </IconButton>
    </Tooltip>
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: collapsed ? "column" : "row",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          gap: collapsed ? 1.5 : 1.5,
          px: collapsed ? 0 : 2.25,
          pt: 2,
          pb: 1.5,
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        <Box
          sx={{
            width: 38,
            height: 38,
            flex: "0 0 38px",
            display: "grid",
            placeItems: "center",
            color: "#fff",
            background: "linear-gradient(135deg, #6a84ff 0%, #4157e8 100%)",
            borderRadius: "12px",
            boxShadow: "0 6px 16px rgba(65, 87, 232, 0.45)",
            display: collapsed ? "none" : "grid",
          }}
        >
          <DescriptionOutlinedIcon sx={{ fontSize: 20 }} />
        </Box>

        {!collapsed && (
          <Typography
            noWrap
            sx={{
              ...fadeSx,
              flex: collapsed ? "0 0 auto" : 1,
              color: COLORS.textActive,
              fontSize: 21,
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            Invoice System
          </Typography>
        )}

        {toggleButton}
      </Box>

      <List
        component="nav"
        sx={{
          px: collapsed ? 1.25 : 1.5,
          pt: collapsed ? 2 : 6,
          flex: 1,
          transition: `padding ${DURATION} ${EASE}`,
        }}
      >
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname.startsWith(href);

          return (
            <Tooltip
              key={href}
              title={collapsed ? label : ""}
              placement="right"
            >
              <ListItemButton
                component={NextLink}
                href={href}
                selected={isActive}
                onClick={onNavigate}
                aria-label={collapsed ? label : undefined}
                sx={{
                  position: "relative",
                  minHeight: 52,
                  mb: 1.7,
                  px: 1.5,
                  gap: collapsed ? 0 : 1.5,
                  justifyContent: collapsed ? "center" : "flex-start",
                  borderRadius: "12px",
                  bgcolor: "rgba(255, 255, 255, 0.08)",
                  color: COLORS.text,
                  transition: `background-color 160ms ${EASE}, color 160ms ${EASE}, box-shadow 160ms ${EASE}`,
                  "& .MuiListItemIcon-root": {
                    minWidth: 0,
                    justifyContent: "center",
                    color: isActive ? COLORS.textActive : COLORS.textMuted,
                    transition: `color 160ms ${EASE}, transform 160ms ${EASE}`,
                  },
                  "& .MuiListItemText-root": { ...fadeSx, m: 0 },
                  "& .MuiListItemText-primary": {
                    fontSize: 18.5,
                    fontWeight: 500,
                    letterSpacing: "0.005em",
                  },
                  "&:hover": {
                    color: COLORS.textActive,
                    bgcolor: "rgba(255, 255, 255, 0.15)",
                  },
                  "&:hover .MuiListItemIcon-root": {
                    color: COLORS.textActive,
                    transform: "scale(1.08)",
                  },
                  "&.Mui-selected": {
                    color: COLORS.textActive,
                    bgcolor: "#4367ed",
                    boxShadow: "0 8px 18px rgba(50, 77, 208, 0.35)",
                  },
                  "&.Mui-selected .MuiListItemText-primary": {
                    fontWeight: 600,
                  },
                  "&.Mui-selected:hover": { bgcolor: "#4b6ff2" },
                  "&.Mui-focusVisible": {
                    outline: "2px solid #aeb8ff",
                    outlineOffset: 2,
                  },
                }}
              >
                <ListItemIcon>
                  <Icon sx={{ fontSize: 21 }} />
                </ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>

      <Typography
        sx={{
          ...fadeSx,
          px: 2,
          py: 2,
          maxHeight: collapsed ? 0 : 40,
          borderTop: collapsed ? "none" : `1px solid ${COLORS.border}`,
          color: COLORS.textMuted,
          fontSize: 15,
        }}
      >
        v1.0 · Invoice System
      </Typography>
    </>
  );
}
