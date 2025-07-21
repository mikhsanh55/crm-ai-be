import { ApiError } from "./api-error"
import { Prisma } from "@prisma/client"
import httpStatus from 'http-status'

export function handlePrismaError(e: any): never {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === 'P2002') {
      const meta = e.meta as { target: string[] }
      throw new ApiError(httpStatus.CONFLICT, `Field(s) ${meta.target.join(', ')} already exist.`)
    }
  }

  if (e instanceof Prisma.PrismaClientValidationError) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Validation error: ${e.message}`)
  }

  throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, e.message || 'Internal server error')
}