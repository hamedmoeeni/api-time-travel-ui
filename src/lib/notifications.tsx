import {ResponseError} from "@/src/lib/axios";
import {NotificationInstance} from "antd/es/notification/interface";

export function notifySuccess(message: string, notificationApi: NotificationInstance) {
    notificationApi['success']({
        title: 'Done',
        description: <>{message}</>,
        duration: 0,
    });
}

export function notifyError(error: ResponseError, notificationApi: NotificationInstance) {
    notificationApi['error']({
        title: 'Error',
        description: <>{error.status} {error.error}<br/>RequestId: {error.requestId}</>,
        duration: 0
    });
}