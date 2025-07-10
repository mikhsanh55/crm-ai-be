export class ApiError extends Error {
  statusCode: number
  isOperational: boolean
  status?: string
  details?: object

  constructor(statusCode: number, message: string, isOperational = true, status = 'ok', details = {}) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.status = status
    this.details = details
  }
}