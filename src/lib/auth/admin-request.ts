import type { NextRequest } from "next/server";
import { extractTokenFromHeader, verifyToken, type JWTPayload } from "./jwt";

export async function requireAdminRequest(
  request: NextRequest
): Promise<{ ok: true; user: JWTPayload } | { ok: false; status: 401; error: string }> {
  const authHeader = request.headers.get("authorization");
  const bearerToken = extractTokenFromHeader(authHeader);
  const cookieToken = request.cookies.get("auth-token")?.value;
  const token = bearerToken || cookieToken || null;

  if (!token) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return { ok: false, status: 401, error: "Invalid token" };
  }

  return { ok: true, user: payload };
}
