import {createContext} from "react";
import {RoutingRestApi} from "@/src/lib/RoutingRestApi";

export interface LayoutProps {
    notificationService: NotificationService,
    routingRestApi: RoutingRestApi
}

export const LayoutPropsContext = createContext<LayoutProps>({} as LayoutProps);