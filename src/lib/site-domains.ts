export const defaultRootDomain = "s-techsolutions.org";

export type DepartmentSite = "corporate" | "shop" | "portal" | "staff" | "local";
export type PublicDepartmentSite = Exclude<DepartmentSite, "local">;

function cleanRootDomain(value: string) {
  return value.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
}

function cleanHostname(value: string) {
  const hostname = value.trim().toLowerCase().split(",")[0]?.trim() ?? "";
  return hostname.replace(/:\d+$/, "").replace(/\.$/, "");
}

export function configuredRootDomain() {
  return cleanRootDomain(process.env.NEXT_PUBLIC_ROOT_DOMAIN || defaultRootDomain);
}

export function departmentForHostname(hostname: string, rootDomain = configuredRootDomain()): DepartmentSite {
  const host = cleanHostname(hostname);
  const root = cleanRootDomain(rootDomain);

  if (host === `shop.${root}`) return "shop";
  if (host === `portal.${root}`) return "portal";
  if (host === `staff.${root}`) return "staff";
  if (host === root || host === `www.${root}`) return "corporate";

  return "local";
}

export function departmentUrl(site: PublicDepartmentSite, path = "/", rootDomain = configuredRootDomain()) {
  const root = cleanRootDomain(rootDomain);
  const subdomain = site === "corporate" ? "www" : site;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `https://${subdomain}.${root}${normalizedPath}`;
}
