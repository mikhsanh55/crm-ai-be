import { Prisma, PrismaClient } from "@prisma/client";
import httpStatus from "http-status";
import type { CreatePipeline, GetPipelinesParams } from "./pipeline.dto";
import { ApiError } from "@/utils/api-error";

const prisma = new PrismaClient()

export async function getPipelines(params: GetPipelinesParams): Promise<Record<string, any>> {
    try {
        const {start, length, search} = params

        // build where clauses
        const where: Prisma.PipelineWhereInput = {
            ...(
                search ? {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } }
                    ]
                } : {}
            )
        }

        // create queries
        const [recordsTotal, recordsFiltered, data] = await Promise.all([
            prisma.pipeline.count(),
            prisma.pipeline.count({ where }),
            prisma.pipeline.findMany({
                where,
                skip: start,
                take: length,
                orderBy: {
                    id: 'desc'
                }
            })
        ])

        return {
            success: true,
            data,
            recordsFiltered,
            recordsTotal
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
        throw e
    }
}

export async function getPipelineById(id: string): Promise<Record<string, any> | null> {
    try {
        const pipeline = await prisma.pipeline.findUnique({
            where: {
                id
            }
        })

        return {
            success: true,
            data: pipeline
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
        throw e
    }
}

export async function createPipeline(payload: CreatePipeline): Promise<Record<string, any>> {
    try {
        const pipeline = await prisma.pipeline.create({
            data: payload
        })

        return {
            success: true,
            data: pipeline
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

export async function updatePipeline(id: string, payload: CreatePipeline): Promise<Record<string, any>> {
    try {
        const latestData = await prisma.pipeline.update({
            where: {
                id
            },
            data: payload
        })

        return {
            success: true,
            data: latestData
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

export async function destroyPipeline(id: string): Promise<Record<string, any>> {
    try {
        await prisma.pipeline.delete({
            where: { id }
        })

        return {
            success: true,
            data: {},
            message: 'Pipeline has been deleted successfully'
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