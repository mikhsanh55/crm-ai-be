import type { Handler, Context } from 'hono'
import httpStatus from 'http-status'
import * as service from './dealstage.service'
import * as validation from './dealstage.validation'
import { handlePrismaError } from '@/utils/prisma-error.handler'

export const getDealStages: Handler = async (c: Context) => {
  const { pipelineId } = validation.getDealStages.parse(c.req.query())
  const result = await service.getDealStages(pipelineId)

  return c.json(result, httpStatus.OK)
}

export const getDealStageById: Handler = async (c: Context) => {
  const id = c.req.param('id')
  const result = await service.getDealStageById(id)

  return c.json(result, httpStatus.OK)
}

export const createDealStage: Handler = async (c: Context) => {
    try {
        const payload = validation.createDealStage.parse(await c.req.json())
        const result = await service.createDealStage(payload)
      
        return c.json(result, httpStatus.CREATED)
    }
    catch(e: any) {
        handlePrismaError(e)
    }
}

export const updateDealStage: Handler = async (c: Context) => {
    try {
        const id = c.req.param('id')
        const payload = validation.createDealStage.parse(await c.req.json())
        const result = await service.updateDealStage(id, payload)
      
        return c.json(result, httpStatus.OK)
    }
    catch(e: any) {
        handlePrismaError(e)
    }
}

export const deleteDealStage: Handler = async (c: Context) => {
    try {
        const id = c.req.param('id')
        const result = await service.destroyDealStage(id)
      
        return c.json(result, httpStatus.OK)
    }
    catch(e: any) {
        handlePrismaError(e)
    }
}