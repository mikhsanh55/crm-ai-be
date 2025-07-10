import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import httpStatus from "http-status";
import { routes } from "./routes";

const app = new Hono()

// apply cors and logger
app.use("*", logger())
app.use("*", cors())
app.use('*', prettyJSON())

// apply 404 not found
app.notFound((c) => {
    return c.json({
        error: 'not found',
        status: 404,
        message: 'The requested resource was not found on this server',
    }, httpStatus.NOT_FOUND)
})

// apply routes
app.get('/', (c) => {
    return c.json({
        message: 'Welcome CRM with AI API!',
        version: '1.0.0',
        documentation: '/docs',
    })
})
routes.forEach((route) => {
    app.route(route.path, route.route as Hono)
})

const port = parseInt(process.env.PORT || '3000')

Bun.serve({
    fetch: app.fetch,
    port
})

console.log(`⚙️ Bun dev server running on http://localhost:${port}`)