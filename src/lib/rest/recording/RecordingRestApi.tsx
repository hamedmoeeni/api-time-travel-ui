import {RestApi} from "@/src/lib/infrastructure/rest/RestApi";
import {PageDto} from "@/src/lib/rest/PageDto";

export interface RecordingDto {
    requestId: string;
    routeId: string;
    timestamp: number;
    url: string;
    method: string;
    requestHeaders: string;
    requestBody: string;
    duration: number;
    responseStatus: string;
    responseHeaders: string;
    responseBody: string;
}

export class RecordingRestApi {
    private restApi: RestApi;

    constructor(restApi: RestApi) {
        this.restApi = restApi;
    }

    GetRecordings(filter: Map,
                  pageNumber: number | undefined,
                  pageSize: number | undefined,
                  sortBy: string | undefined,
                  sortOrder: string | undefined): Promise<void | PageDto<RecordingDto>> {
        return this.restApi.get<PageDto<RecordingDto>>(process.env.NEXT_PUBLIC_API_PATH_RECORDINGS as string, {
        ...filter,
            pageNumber: pageNumber,
            pageSize: pageSize,
            sortBy: sortBy,
            sortOrder: sortOrder
        });
    }
}