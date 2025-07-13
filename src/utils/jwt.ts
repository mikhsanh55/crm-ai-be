import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!
const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRATION_MINUTES ? Number.parseInt(process.env.JWT_ACCESS_EXPIRATION_MINUTES, 10) * 60 : 30 * 60 // 30 menit detik
const REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRATION_DAYS ? Number.parseInt(process.env.JWT_REFRESH_EXPIRATION_DAYS, 10) : 7 // 7 hari detik
const EMAIL_VERIFICATION_TOKEN_EXPIRES_IN = process.env.JWT_EMAIL_VERIFICATION_EXPIRATION_DAYS ? Number.parseInt(process.env.JWT_EMAIL_VERIFICATION_EXPIRATION_DAYS, 10) : 1

function minutesToMs(minutes: number) {
  return minutes * 60 * 1000
}

function daysToMs(days: number) {
  return days * 24 * 60 * 60 * 1000
}

export function signAccessToken(payload: object): { token: string, expiresAt: Date } {
  const expiresInMs = minutesToMs(ACCESS_TOKEN_EXPIRES_IN)
  const expiresAt = new Date(Date.now() + expiresInMs)
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN })

  return { token, expiresAt }
}

export function signEmailVerificationToken(payload: object): { token: string, expiresAt: Date } {
  const expiresInMs = daysToMs(EMAIL_VERIFICATION_TOKEN_EXPIRES_IN)
  const expiresAt = new Date(Date.now() + expiresInMs)
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: EMAIL_VERIFICATION_TOKEN_EXPIRES_IN })

  return { token, expiresAt }
}

export function signRefreshToken(payload: object): { token: string, expiresAt: Date } {
  const expiresInMs = daysToMs(REFRESH_TOKEN_EXPIRES_IN)
  const expiresAt = new Date(Date.now() + expiresInMs)
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN })

  return { token, expiresAt }
}

export function signForgotPasswordToken(payload: object): { token: string, expiresAt: Date } {
  const FORGOT_PASSWORD_EXPIRES_IN_MINUTE = 60
  const expiresInSeconds = FORGOT_PASSWORD_EXPIRES_IN_MINUTE * 60
  const expiresAt = new Date(Date.now() + expiresInSeconds)
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: expiresInSeconds })

  return { token, expiresAt }
}

export function verifyToken<T = any>(token: string): T {
  return jwt.verify(token, JWT_SECRET) as T
}
