import { z } from 'zod'

export const createDealStage = z.strictObject({
  name: z.string(),
  order: z.number(),
  pipelineId: z.string().uuid()
})

export const getDealStages = z.object({
  pipelineId: z.string().uuid().optional()
})