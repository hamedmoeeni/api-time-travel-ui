import {createContext} from "react";
import {RecordingRestApi} from "@/src/lib/rest/recording/RecordingRestApi";
import {RoutingRestApi} from "@/src/lib/rest/routing/RoutingRestApi";

export interface LayoutProps {
    notificationService: NotificationService,
    routingRestApi: RoutingRestApi,
    recordingRestApi: RecordingRestApi
}

export const LayoutPropsContext = createContext<LayoutProps>({} as LayoutProps);