import { route as authRoute } from "@/api/v1/auth/auth.route";
import { route as pipelineRoute } from "@/api/v1/pipeline/pipeline.route";
import { route as dealstageRoute } from "@/api/v1/dealstage/dealstage.route";

const firstVersionPrefix = 'v1'

export const routes = [
    {
        path: `/${firstVersionPrefix}/auth`,
        route: authRoute
    },
    {
        path: `/${firstVersionPrefix}/pipeline`,
        route: pipelineRoute
    },
    {
        path: `/${firstVersionPrefix}/dealstage`,
        route: dealstageRoute
    }
]