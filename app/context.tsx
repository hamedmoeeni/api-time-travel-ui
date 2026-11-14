import {createContext} from "react";
import {RecordingRestApi} from "@/src/lib/rest/recording/RecordingRestApi";
import {RoutingRestApi} from "@/src/lib/rest/routing/RoutingRestApi";
import {StatsApi} from "@/src/lib/rest/stats/StatsApi";

export interface LayoutProps {
    notificationService: NotificationService,
    routingRestApi: RoutingRestApi,
    recordingRestApi: RecordingRestApi,
    statsApi: StatsApi
}

export const LayoutPropsContext = createContext<LayoutProps>({} as LayoutProps);