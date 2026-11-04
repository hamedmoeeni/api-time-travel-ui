export interface RestApi {
    postApi<T>(path: string, body: unknown, notificationService: NotificationService): Promise<void | T>

    deleteApi<T>(path: string, body: unknown, notificationService: NotificationService): Promise<void | T>

    get<T>(url: string): Promise<void | T>;
}