import type { Handler, Context } from "hono";
import httpStatus from 'http-status'
import * as pipelineValidation from './pipeline.validation'
import * as pipelineService from './pipeline.service'

export const getPipelines: Handler = async(c: Context) => {
    const { start, length, search } = pipelineValidation.getPipelines.parse(c.req.query())
    
    const results = await pipelineService.getPipelines({ start, length, search })

    return c.json(results, httpStatus.OK)
}

export const createPipeline: Handler = async(c: Context) => {
    const rawPayload = await c.req.json()
    const parsedData = pipelineValidation.createPipeline.parse(rawPayload)
    const user = c.get('user')

    const result = await pipelineService.createPipeline({
        ...parsedData,
        ownerId: user.id
    })

    return c.json(result, httpStatus.OK)
}