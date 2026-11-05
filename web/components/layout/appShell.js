"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import NavList from "@/components/layout/navList";
import { useNotify } from "@/hooks/useNotify";
const DRAWER_WIDTH = 297;
const COLLAPSED_DRAWER_WIDTH = 92;

export default function AppShell({ user, children }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const notify = useNotify();
  const toggleDrawer = () => setMobileOpen((open) => !open);
  const closeDrawer = () => setMobileOpen(false);
  const toggleSidebar = () => setSidebarExpanded((expanded) => !expanded);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    notify.success("Signed out");
    router.replace("/login");
    router.refresh();
  };

  const mobileNav = <NavList onNavigate={closeDrawer} />;
  const desktopNav = (
    <NavList
      collapsed={!sidebarExpanded}
      onNavigate={closeDrawer}
      onToggle={toggleSidebar}
    />
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100dvh" }}>
      <Box
        component="a"
        href="#main-content"
        className="no-print"
        sx={{
          position: "absolute",
          left: -9999,
          "&:focus": {
            left: 8,
            top: 8,
            zIndex: (theme) => theme.zIndex.tooltip,
            bgcolor: "background.paper",
            p: 1,
            borderRadius: 1,
          },
        }}
      >
        Skip to content
      </Box>
      <AppBar
        className="no-print"
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          left: {
            md: `${sidebarExpanded ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH}px`,
          },
          width: {
            md: `calc(100% - ${sidebarExpanded ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH}px)`,
          },
          bgcolor: "#fff",
          color: "#182955",
          boxShadow: "none",
          borderBottom: "1px solid #e5eaf3",
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, md: 72 }, px: { xs: 2, md: 3 } }}>
          <IconButton
            edge="start"
            onClick={toggleDrawer}
            aria-label="Open navigation"
            sx={{ mr: 1, color: "text.primary", display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Typography
            variant="body2"
            sx={{
              mr: 1.5,
              color: "text.secondary",
              display: { xs: "none", sm: "block" },
              fontSize: 18,
            }}
          >
            {user.name}
          </Typography>
          <Tooltip title="Logout" placement="bottom">
            <IconButton
              onClick={handleLogout}
              aria-label="Sign out"
              sx={{
                color: "text.secondary",
                fontSize: 18,
                display: { xs: "none", sm: "inline-flex" },
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box
        className="no-print"
        component="nav"
        sx={{
          width: {
            md: sidebarExpanded ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH,
          },
          flexShrink: { md: 0 },
          transition: "width 180ms ease",
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={closeDrawer}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              color: "#f5f6fb",
              background: "#2e3c5e",
              borderRight: "1px solid rgba(255,255,255,0.06)",
            },
          }}
        >
          {mobileNav}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: sidebarExpanded ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH,
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              color: "#f5f6fb",
              background: "#1b3169",
              borderRight: "1px solid rgba(255,255,255,0.06)",
              overflowX: "hidden",
              transition: "width 180ms ease",
            },
          }}
        >
          {desktopNav}
        </Drawer>
      </Box>

      <Box
        id="main-content"
        component="main"
        tabIndex={-1}
        sx={{
          flexGrow: 1,
          minWidth: 0,
          minHeight: "100dvh",
          bgcolor: "background.default",
          p: { xs: 2, sm: 3, lg: 4 },
        }}
      >
        <Toolbar className="no-print" sx={{ minHeight: { xs: 64, md: 72 } }} />
        {children}
      </Box>
    </Box>
  );
}
