"use client";

import { usePathname } from "next/navigation";
import {
  Box,
  Stack,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import NextLink from "@/components/ui/nextLink";

function getDefaultBreadcrumbs(pathname, title) {
  if (!pathname || pathname === "/" || pathname === "/dashboard") {
    return [{ label: "Dashboard" }];
  }

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = [{ label: "Dashboard", href: "/dashboard" }];

  if (segments[0] === "invoices") {
    if (segments.length === 1) {
      crumbs.push({ label: "Invoices" });
    } else if (segments.length === 2 && segments[1] === "new") {
      crumbs.push({ label: "Invoices", href: "/invoices" });
      crumbs.push({ label: title || "New invoice" });
    } else if (segments.length === 2) {
      crumbs.push({ label: "Invoices", href: "/invoices" });
      crumbs.push({ label: title || "Invoice" });
    } else if (segments.length >= 3 && segments[2] === "edit") {
      crumbs.push({ label: "Invoices", href: "/invoices" });
      crumbs.push({
        label: title ? title.replace(/^Edit\s+/, "Invoice ") : "Invoice",
        href: `/invoices/${segments[1]}`,
      });
      crumbs.push({ label: "Edit" });
    }
  } else if (segments[0] === "clients") {
    if (segments.length === 1) {
      crumbs.push({ label: "Clients" });
    } else if (segments.length === 2 && segments[1] === "new") {
      crumbs.push({ label: "Clients", href: "/clients" });
      crumbs.push({ label: title || "New client" });
    } else if (segments.length === 2) {
      crumbs.push({ label: "Clients", href: "/clients" });
      crumbs.push({ label: title || "Client" });
    } else if (segments.length >= 3 && segments[2] === "edit") {
      crumbs.push({ label: "Clients", href: "/clients" });
      crumbs.push({ label: title || "Edit" });
    }
  } else {
    segments.forEach((seg, i) => {
      const isLast = i === segments.length - 1;
      const href = "/" + segments.slice(0, i + 1).join("/");
      const label =
        isLast && title ? title : seg.charAt(0).toUpperCase() + seg.slice(1);
      crumbs.push(isLast ? { label } : { label, href });
    });
  }

  return crumbs;
}

export default function PageHeader({ title, subtitle, action, breadcrumbs }) {
  const pathname = usePathname();

  const items =
    Array.isArray(breadcrumbs) && breadcrumbs.length > 0
      ? breadcrumbs
      : breadcrumbs === false
        ? []
        : getDefaultBreadcrumbs(pathname, title);

  return (
    <Stack className="no-print" spacing={1}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
        }}
      >
        <Box sx={{ borderLeft: "4px solid #5965f5", pl: 1.5 }}>
          <Typography variant="h4" component="h1" fontWeight={700}>
            {title}
          </Typography>

          {subtitle && (
            <Typography sx={{ color: "text.secondary" }}>{subtitle}</Typography>
          )}
        </Box>

        {action}
        {items.length > 0 && (
          <Breadcrumbs
            separator="›"
            aria-label="breadcrumb"
            sx={{
              fontSize: "1.2rem",
              "& .MuiBreadcrumbs-separator": {
                color: "text.disabled",
                mx: 0.75,
              },
            }}
          >
            {items.map((item, index) => {
              const isLast = index === items.length - 1;
              return isLast || !item.href ? (
                <Typography
                  key={item.label + index}
                  color="text.primary"
                  sx={{ fontSize: "inherit", fontWeight: 600 }}
                >
                  {item.label}
                </Typography>
              ) : (
                <MuiLink
                  key={item.label + index}
                  component={NextLink}
                  href={item.href}
                  underline="hover"
                  color="text.secondary"
                  sx={{
                    fontSize: "inherit",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  {item.label}
                </MuiLink>
              );
            })}
          </Breadcrumbs>
        )}
      </Stack>
    </Stack>
  );
}
