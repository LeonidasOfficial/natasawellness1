import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export interface AdminUser {
  email: string
  passwordHash: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(email: string): string {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): { email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { email: string }
  } catch {
    return null
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get('admin_token')?.value
}

export async function removeAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_token')
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthCookie()
  if (!token) return false
  
  const verified = verifyToken(token)
  return verified !== null
}

export async function verifyAuth(_request: Request) {
  try {
    // Try to get token from cookie
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value
    
    if (!token) {
      return { isValid: false, email: null }
    }
    
    const verified = verifyToken(token)
    if (!verified) {
      return { isValid: false, email: null }
    }
    
    return { isValid: true, email: verified.email }
  } catch (_error) {
    return { isValid: false, email: null }
  }
}

