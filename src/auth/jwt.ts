// user\src\auth\jwt.ts
import {
  sign,
  verify,
  type Algorithm,
  type SignOptions,
  type JwtPayload,
} from "jsonwebtoken";
import { createPrivateKey, createPublicKey } from "crypto";
import ms, { type StringValue } from "ms";

type ExpiresIn = number | StringValue;

const isMsStringValue = (s: string): s is StringValue =>
  ms(s as StringValue) !== undefined; // runtime check via ms()

const parseExpiresIn = (
  v: string | undefined,
  fallback: StringValue,
): ExpiresIn => {
  if (!v) return fallback;
  const n = Number(v);
  if (!Number.isNaN(n) && n > 0) return n; // numeric seconds
  if (isMsStringValue(v)) return v; // "15m", "1h", etc.
  throw new Error(`Invalid expiresIn: ${v}`);
};

const ACCESS_TTL = parseExpiresIn(process.env.ACCESS_TOKEN_TTL, "15m");
const REFRESH_TTL = parseExpiresIn(process.env.REFRESH_TOKEN_TTL, "30d");
const ALG: Algorithm = "RS256";

// PEMs from env (escaped newlines -> real newlines)
const PRIVATE_PEM = process.env.JWT_PRIVATE_KEY!.replace(/\\n/g, "\n");
const PUBLIC_PEM = process.env.JWT_PUBLIC_KEY!.replace(/\\n/g, "\n");

// Use KeyObjects so TS is happy with key types
const PRIVATE_KEY = createPrivateKey({ key: PRIVATE_PEM });
const PUBLIC_KEY = createPublicKey({ key: PUBLIC_PEM });

export type AccessPayload = { sub: string; scope?: string[] };
export type RefreshPayload = { sub: string; rot?: string };

const signOpts = (expiresIn: ExpiresIn): SignOptions => ({
  algorithm: ALG,
  expiresIn,
  keyid: "k1",
});

export type AccessClaims = { sub: string; scope?: string[] } & JwtPayload;
export type RefreshClaims = { sub: string; rot?: string } & JwtPayload;

export const signAccess = (p: AccessPayload) =>
  sign(p, PRIVATE_KEY, signOpts(ACCESS_TTL));
export const signRefresh = (p: RefreshPayload) =>
  sign(p, PRIVATE_KEY, signOpts(REFRESH_TTL));

export const verifyAccess = (t: string): AccessClaims =>
  verify(t, PUBLIC_KEY, { algorithms: [ALG] }) as AccessClaims;

export const verifyRefresh = (t: string): RefreshClaims =>
  verify(t, PUBLIC_KEY, { algorithms: [ALG] }) as RefreshClaims;
