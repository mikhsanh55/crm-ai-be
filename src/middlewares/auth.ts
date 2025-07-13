import type { MiddlewareHandler } from 'hono'
import { PrismaClient } from '@prisma/client'
import { ApiError } from '@/utils/api-error'
import httpStatus from 'http-status'
import { verifyToken } from '@/utils/jwt'

const prisma = new PrismaClient()

export const auth: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authorization token missing')
  }

  const token = authHeader.split(' ')[1] || ""

  try {
    const decoded = verifyToken<{ sub: string }>(token)

    const user = await prisma.user.findUnique({
    where: { id: decoded.sub },
      select: {
        id: true,
        name: true,
        email: true
      },
    })

    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found')
    }

    c.set('user', user) // inject ke context

    await next()
  }
  catch (err: any) {
    throw new ApiError(httpStatus.UNAUTHORIZED, err.message || 'Invalid or expired token')
  }
}