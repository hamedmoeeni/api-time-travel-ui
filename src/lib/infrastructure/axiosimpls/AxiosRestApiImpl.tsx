import axios, {AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from "axios";
import {mutate} from "swr";
import {RestApi} from "@/src/lib/infrastructure/rest/RestApi";

interface ResponseError {

    timestamp: string,
    path: string,
    status: number,
    error: string,
    requestId: string
}

export class AxiosRestApiImpl implements RestApi {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_BASE_URL as string,
            timeout: 5000
        });

        this.api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
            config.headers['Content-Type'] = 'application/json';
            return config;
        });

        this.api.interceptors.response.use(
            (response: AxiosResponse) => {
                return response;
            },
            (error: AxiosError) => {
                let responseError;
                if (axios.isAxiosError<ResponseError>(error)) {
                    responseError = error.response?.data;
                }
                if (!responseError) {
                    responseError = {
                        status: error?.status,
                        error: error?.message,
                        requestId: "",
                        timestamp: "",
                        path: ""
                    } as ResponseError;
                }

                return Promise.reject(responseError);
            }
        );
    }

    private handleError(error: ResponseError, notificationService: NotificationService) {
        notificationService.notifyError(
            error.status ? error.status.toString() : '',
            error.error ? error.error : '',
            error.requestId ? error.requestId : '');

        throw error;
    }

    get<T>(url: string,): Promise<T> {
        return this.api.get(url).then((response: AxiosResponse) => response.data);
    }


    postApi<T>(path: string, body: unknown, notificationService: NotificationService): Promise<void | T> {
        return this.api.post(path, body)
            .then((response) => {
                notificationService.notifySuccess(response.data?.message)
                mutate(path);
                return response.data;
            })
            .catch((error: ResponseError) => this.handleError(error, notificationService));
    }

    deleteApi<T>(path: string, body: unknown, notificationService: NotificationService): Promise<void | T> {
        return this.api.delete(path, {data: body})
            .then((response) => {
                notificationService.notifySuccess(response.data?.message)
                mutate(path);
                return response.data;
            })
            .catch((error: ResponseError) => this.handleError(error, notificationService));
    }
}