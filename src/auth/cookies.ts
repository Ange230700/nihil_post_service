// user\src\auth\cookies.ts

export const refreshCookieOpts = {
  httpOnly: true,
  secure: true,
  sameSite: "strict" as const,
  path: "/api/auth",
};
