// post\src\auth\jwt.ts
import jwt, {
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

let _privateKey: ReturnType<typeof createPrivateKey> | null = null;
let _publicKey: ReturnType<typeof createPublicKey> | null = null;

function getPrivateKey() {
  if (_privateKey) return _privateKey;
  const pem = process.env.JWT_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!pem) throw new Error("JWT_KEYS_MISSING");
  _privateKey = createPrivateKey({ key: pem });
  return _privateKey;
}
function getPublicKey() {
  if (_publicKey) return _publicKey;
  const pem = process.env.JWT_PUBLIC_KEY?.replace(/\\n/g, "\n");
  if (!pem) throw new Error("JWT_KEYS_MISSING");
  _publicKey = createPublicKey({ key: pem });
  return _publicKey;
}

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
  jwt.sign(p, getPrivateKey(), signOpts(ACCESS_TTL));
export const signRefresh = (p: RefreshPayload) =>
  jwt.sign(p, getPrivateKey(), signOpts(REFRESH_TTL));

export const verifyAccess = (t: string): AccessClaims =>
  jwt.verify(t, getPublicKey(), { algorithms: [ALG] }) as AccessClaims;

export const verifyRefresh = (t: string): RefreshClaims =>
  jwt.verify(t, getPublicKey(), { algorithms: [ALG] }) as RefreshClaims;
