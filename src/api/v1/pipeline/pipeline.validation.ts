import {z} from "zod"

export const getPipelines = z.object({
    start: z.coerce.number(),
    length: z.coerce.number(),
    search: z.string().optional()
})

export const createPipeline = z.strictObject({
    name: z.string(),
    description: z.string()
})