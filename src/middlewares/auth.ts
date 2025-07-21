import type { MiddlewareHandler } from 'hono'
import { PrismaClient } from '@prisma/client'
import httpStatus from 'http-status'
import { verifyToken } from '@/utils/jwt'

const prisma = new PrismaClient()

export const auth: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('Authorization')

  // Check if Authorization token is missing
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({
      message: 'Authorization token missing'
    }, httpStatus.UNAUTHORIZED)
  }

  const token = authHeader.split(' ')[1] || ""

  try {
    // Verifying the token and decoding it
    const decoded = verifyToken<{ sub: string }>(token)

    // Check if the user exists in the database
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: {
        id: true,
        name: true,
        email: true
      },
    })

    if (!user) {
      return c.json({
        message: 'User not found'
      }, httpStatus.UNAUTHORIZED)
    }

    // Attach user to the context for further use
    c.set('user', user)
    await next()
  } catch (err: any) {
    // Define error messages for common JWT errors
    const jwtErrorMessages: Record<string, string> = {
      'TokenExpiredError': 'Your session has expired. Please log in again.',
      'JsonWebTokenError': 'Invalid authentication token.',
      'NotBeforeError': 'Token is not active yet.',
      'PrismaClientKnownRequestError': 'Database error occurred.'
    }

    const errorMessage = jwtErrorMessages[err.name] || 'Authentication failed'

    // Log the error for debugging purposes
    console.error('Error in auth middleware:', err)

    // Return the error response with proper message
    return c.json({
      message: errorMessage
    }, httpStatus.UNAUTHORIZED)
  }
}