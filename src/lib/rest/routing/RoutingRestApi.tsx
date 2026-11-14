import useSWR from "swr";
import {RestApi} from "@/src/lib/infrastructure/rest/RestApi";

export interface RoutingDto {
    id: string,
    priority: number,
    sourceHost: string,
    sourcePath: string,
    method: string,
    destinationHostUri: string
}

export class RoutingRestApi {
    private restApi: RestApi;

    constructor(restApi: RestApi) {
        this.restApi = restApi;
    }

    useSwrGetRoute() {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useSWR(process.env.NEXT_PUBLIC_API_PATH_ROUTES, () => {
            return this.restApi.get<RoutingDto[]>(process.env.NEXT_PUBLIC_API_PATH_ROUTES as string, null);
        });
    }

    saveRoutes = (routing: RoutingDto[], notificationService: NotificationService) => {
        return this.restApi.postApi(process.env.NEXT_PUBLIC_API_PATH_ROUTES as string, routing, notificationService);
    }

    deleteRoutes = (routingIds: string[], notificationService: NotificationService) => {
        return this.restApi.deleteApi(process.env.NEXT_PUBLIC_API_PATH_ROUTES as string, routingIds, notificationService);
    }
}