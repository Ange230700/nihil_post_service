// user\src\types\express.d.ts

import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    auth?: { sub: string; scope?: string[] };
    cookies?: Record<string, string>;
    signedCookies?: Record<string, string>;
  }
}
