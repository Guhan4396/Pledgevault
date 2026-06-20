import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "pledgevault-secret-change-in-production"
const JWT_EXPIRES = "8h"

export interface JWTPayload {
  userId: string
  email: string
  role: string
  branchIds: string[]
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export async function getAuthUser(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value
    if (!token) return null
    return verifyToken(token)
  } catch {
    return null
  }
}

export function hasRole(user: JWTPayload | null, roles: string[]): boolean {
  if (!user) return false
  return roles.includes(user.role)
}

export function canAccessBranch(user: JWTPayload | null, branchId: string): boolean {
  if (!user) return false
  if (user.role === "OWNER") return true
  return user.branchIds.includes(branchId)
}
