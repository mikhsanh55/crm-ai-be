import { PrismaClient, Prisma } from '@prisma/client'
import type { CreateDealStage } from './dealstage.dto'
import httpStatus from 'http-status'
import { ApiError } from '@/utils/api-error'

const prisma = new PrismaClient()

export async function getDealStages(pipelineId?: string) {
  const where: Prisma.DealStageWhereInput = pipelineId ? { pipelineId } : {}

  const stages = await prisma.dealStage.findMany({
    where,
    orderBy: { order: 'asc' }
  })

  return {
    success: true,
    data: stages
  }
}

export async function getDealStageById(id: string) {
  const stage = await prisma.dealStage.findUnique({
    where: { id }
  })

  if (!stage) throw new ApiError(httpStatus.NOT_FOUND, 'DealStage not found')

  return {
    success: true,
    data: stage
  }
}

export async function createDealStage(payload: CreateDealStage) {
  const stage = await prisma.dealStage.create({ data: payload })

  return {
    success: true,
    data: stage
  }
}

export async function updateDealStage(id: string, payload: CreateDealStage) {
  const updated = await prisma.dealStage.update({
    where: { id },
    data: payload
  })

  return {
    success: true,
    data: updated
  }
}

export async function destroyDealStage(id: string) {
  await prisma.dealStage.delete({
    where: { id }
  })

  return {
    success: true,
    data: {},
    message: 'DealStage has been deleted successfully'
  }
}