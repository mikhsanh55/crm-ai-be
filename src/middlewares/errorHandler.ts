import type { MiddlewareHandler } from 'hono'
import type { StatusCode } from 'hono/utils/http-status'
import { ApiError } from '@/utils/api-error'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

const isValidStatusCode = (code: number): code is StatusCode => {
  return code >= 100 && code < 600
}

export const errorHandler: MiddlewareHandler = async (c, next) => {
  try {
    await next()
  } catch (err: any) {
    console.error('Error caught by middleware:', err) // Log the full error details
    
    // Handle ApiError instances
    if (err instanceof ApiError) {
      const statusCode = isValidStatusCode(err.statusCode) ? err.statusCode : 500

      // Log the error before returning the response
      console.log('ApiError:', err)

      return c.json(
        {
          success: false,
          message: err.message,
          statusCode: err.statusCode,
          status: err.status,
          ...(err.details && Object.keys(err.details).length > 0 && { details: err.details })
        },
        statusCode as ContentfulStatusCode
      )
    }

    // Handle other errors (non-operational)
    console.log('Non-ApiError:', err)
    return c.json(
      {
        success: false,
        message: 'Internal Server Error dd',
        statusCode: 500,
        status: 'error'
      },
      500 as ContentfulStatusCode
    )
  }
}