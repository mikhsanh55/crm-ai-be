import { route as authRoute } from "@/api/v1/auth/auth.route";

const firstVersionPrefix = 'v1'

export const routes = [
    {
        path: `/${firstVersionPrefix}/auth`,
        route: authRoute
    }
]