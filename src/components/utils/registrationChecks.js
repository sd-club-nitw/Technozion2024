const NITW_DOMAIN = "nitw.ac.in";

export const isNitwEmail = (email) => {
  if (typeof email !== "string") return false;
  const parts = email.trim().toLowerCase().split("@");
  if (parts.length !== 2 || !parts[0]) return false;
  const domain = parts[1];
  return domain === NITW_DOMAIN || domain.endsWith("." + NITW_DOMAIN);
};