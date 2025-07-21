import { Hono } from "hono";
import * as controller from './dealstage.controller'
import { auth as authMiddleware } from "@/middlewares/auth";

export const route = new Hono()

route.get('/', authMiddleware, controller.getDealStages)
route.get('/:id', authMiddleware, controller.getDealStageById)
route.post('/', authMiddleware, controller.createDealStage)
route.put('/:id', authMiddleware, controller.updateDealStage)
route.delete('/:id', authMiddleware, controller.deleteDealStage)