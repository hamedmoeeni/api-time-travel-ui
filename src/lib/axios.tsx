import axios, {AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from "axios";
import {NotificationInstance} from "antd/es/notification/interface";
import {mutate} from "swr";
import {notifyError, notifySuccess} from "@/src/lib/notifications";

export interface ResponseError {

    timestamp: string,
    path: string,
    status: number,
    error: string,
    requestId: string
}

export const api: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL as string,
    timeout: 5000
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    config.headers['Content-Type'] = 'application/json';
    return config;
});

api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        let responseError;
        if (axios.isAxiosError<ResponseError>(error)) {
            responseError = error.response?.data;
        } else {
            responseError = {
                status: error.status,
                error: error.message,
                requestId: "",
                timestamp: "",
                path: ""
            } as ResponseError;
        }

        return Promise.reject(responseError);
    }
);

export function postApi(path: string, body: any, notificationApi: NotificationInstance) {
    return api.post(path, body)
        .then((response) => {
            notifySuccess(response.data?.message, notificationApi)
            mutate(path);
            return response;
        })
        .catch((error) => {
            notifyError(error, notificationApi);
            throw error;
        });
}

export function deleteApi(path: string, body: unknown, notificationApi: NotificationInstance) {
    return api.delete(path, {data: body})
        .then((response) => {
            notifySuccess(response.data?.message, notificationApi)
            mutate(path);
            return response;
        })
        .catch((error) => {
            notifyError(error, notificationApi);
            throw error;
        });
}