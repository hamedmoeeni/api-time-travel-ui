import {NotificationInstance} from "antd/es/notification/interface";
import {notification} from "antd";
import {ReactElement} from "react";

class AntdNotificationServiceImpl implements NotificationService {
    private antdNotification: NotificationInstance;


    constructor(antdNotification: NotificationInstance) {
        this.antdNotification = antdNotification;
    }

    notifySuccess(message: string): void {
        this.antdNotification['success']({
            title: 'Done',
            description: <>{message}</>,
            duration: 180,
        });
    }

    notifyError(status: string, message: string, requestId: string): void {
        this.antdNotification['error']({
            title: 'Error',
            description: <>{status} {message}<br/>{requestId ? "RequestId: " + requestId : ''}</>,
            duration: 180
        });
    }
}

export function getNotificationServiceImpl(): [NotificationService, ReactElement] {
    const [notificationInstance, contextHolder] = notification.useNotification()
    return [new AntdNotificationServiceImpl(notificationInstance), contextHolder];
}