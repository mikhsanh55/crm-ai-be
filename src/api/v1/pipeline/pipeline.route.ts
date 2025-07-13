import { Hono } from "hono";
import * as controller from './pipeline.controller'
import { auth as authMiddleware } from "@/middlewares/auth";

export const route = new Hono()

route.get('/', authMiddleware, controller.getPipelines)
route.post('/', authMiddleware, controller.createPipeline)