import type { Handler, Context } from "hono";
import httpStatus from 'http-status'
import * as pipelineValidation from './pipeline.validation'
import * as pipelineService from './pipeline.service'

export const getPipelines: Handler = async(c: Context) => {
    // You don't need to manually validate here, because zValidator has already validated the query
    const { start, length, search } = pipelineValidation.getPipelines.parse(c.req.query()) // validated data
    
    const results = await pipelineService.getPipelines({ start, length, search })

    return c.json(results, httpStatus.OK)
}

export const getPipelineById: Handler = async(c: Context) => {
    const result = await pipelineService.getPipelineById(c.req.param('id'))

    return c.json(result, httpStatus.OK)
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

export const updatePipeline: Handler = async(c: Context) => {
    const pipelineId = c.req.param('id')

    const rawPayload = await c.req.json()
    const parsedData = pipelineValidation.createPipeline.parse(rawPayload)
    const user = c.get('user')

    const result = await pipelineService.updatePipeline(pipelineId, {
        ...parsedData,
        ownerId: user.id
    })

    return c.json(result, httpStatus.OK)
}

export const deletePipeline: Handler = async (c: Context) => {
    const pipelineId = c.req.param('id')
    const result = await pipelineService.destroyPipeline(pipelineId)

    return c.json(result, httpStatus.OK)
}