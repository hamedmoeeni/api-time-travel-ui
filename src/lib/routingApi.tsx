import {api, deleteApi, postApi} from "./axios"
import useSWR from "swr";
import {NotificationInstance} from "antd/es/notification/interface";

export interface RoutingDto {
    id: string,
    priority: number,
    sourceHost: string,
    sourcePath: string,
    method: string,
    destinationHostUri: string
}

export function useGetRouteSwr() {
    return useSWR(process.env.NEXT_PUBLIC_API_PATH_ROUTES, () => {
        return api.get<RoutingDto[]>(process.env.NEXT_PUBLIC_API_PATH_ROUTES as string);
    });
}

export const saveRoutes = (routing: RoutingDto[], notificationApi: NotificationInstance) => {
    return postApi(process.env.NEXT_PUBLIC_API_PATH_ROUTES as string, routing, notificationApi);
}

export const deleteRoutes = (routingIds: string[], notificationApi: NotificationInstance) => {
    return deleteApi(process.env.NEXT_PUBLIC_API_PATH_ROUTES as string, routingIds, notificationApi);
}