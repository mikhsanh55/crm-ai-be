import { PrismaClient, Prisma } from "@prisma/client";
import httpStatus from 'http-status'
import type { RegisterPayload } from "./auth.dto";
import { ApiError } from "@/utils/api-error";

const prisma = new PrismaClient()

export async function register(payload: RegisterPayload): Promise<Record<string, any>> {
    try {
        return prisma.user.create({
            data: payload
        })
    }
    catch(e: any) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // Error kode unik Prisma (constraint, dsb)
            if (e.code === 'P2002') {
                // Misal: unique constraint failed (email, username, dll)
                const meta = e.meta as { target: string[] }
                throw new ApiError(httpStatus.CONFLICT, `Field(s) ${meta.target.join(', ')} already exist.`)
            }
        }

        if (e instanceof Prisma.PrismaClientValidationError) {
        // Validasi data gagal (typo field, format salah, dsb)
        throw new ApiError(httpStatus.BAD_REQUEST, `Validation error: ${e.message}`)
        }

        // Error lainnya
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, e.message || 'Internal server error')
    }
}
