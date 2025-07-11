import { PrismaClient, Prisma } from "@prisma/client";
import httpStatus from 'http-status'
import type { LoginPayload, RegisterPayload } from "./auth.dto";
import { ApiError } from "@/utils/api-error";
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || "supersecret"

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

export async function login(payload: LoginPayload): Promise<Record<string, any>> {
    try {
        const {email, password} = payload

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if(!user) {
            throw new ApiError(httpStatus.BAD_GATEWAY, "Incorrect Email or Password")
        }

        const token = jwt.sign({
            sub: user.id
        }, JWT_SECRET, {
            expiresIn: '1h'
        })

        return {
            token,
            user: {
                name: user.name,
                email: user.email
            }
        }

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