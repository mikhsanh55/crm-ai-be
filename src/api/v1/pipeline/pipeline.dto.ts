export interface GetPipelinesParams {
    start: number
    length: number
    search?: string | undefined | null
}

export interface CreatePipeline {
    name: string
    description: string
    ownerId: string
}