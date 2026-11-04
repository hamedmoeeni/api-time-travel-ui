interface NotificationService {
    notifySuccess(message: string): void;

    notifyError(status: string, message: string, requestId: string): void;
}