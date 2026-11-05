import { SITE_URL } from "@/lib/site";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/login",
      disallow: ["/api/", "/dashboard", "/invoices", "/clients", "/inv/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
