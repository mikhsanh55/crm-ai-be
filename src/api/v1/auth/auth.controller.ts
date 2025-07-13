import { type Context, type Handler } from "hono";
import * as authValidation from './auth.validation'
import * as authService from './auth.service'
import httpStatus from 'http-status'

export const register: Handler = async (c: Context) => {
    const rawPayload = await c.req.json()
    const parsedData = await authValidation.register.parseAsync(rawPayload)

    const newUser = await authService.register(parsedData)
    const result = {
        success: true,
        message: 'User has been registered successfully, you can login now!',
        data: {
            name: newUser.name,
            email: newUser.email
        }
    }

    return c.json(result, httpStatus.OK)
}

export const login: Handler = async (c: Context) => {
    const rawPayload = await c.req.json()
    const parsedData = await authValidation.login.parse(rawPayload)

    const response = await authService.login(parsedData)

    const result = {
        success: true,
        data: response
    }

    return c.json(result, httpStatus.OK)
}