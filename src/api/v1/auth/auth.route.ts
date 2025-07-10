import { Hono } from "hono";
import * as controller from './auth.controller'

export const route = new Hono()

route.post('/register', controller.register)