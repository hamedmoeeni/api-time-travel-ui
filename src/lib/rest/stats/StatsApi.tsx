import {RestApi} from "@/src/lib/infrastructure/rest/RestApi";

export interface QueryLabelsDto {
    methods: string[];
    status: string[];
    routeIds: string[];
    urls: string[];
}

export interface StatsQueryDto {
    outputType?: string;
    fromTimestamp?: number;
    toTimestamp?: number;
    methods?: string[];
    routeIds?: string[];
    urls?: string[];
    status?: string[];
    groupBy?: string;
}

export interface StatsTimeSeriesDto {
    label: string;
    time: number[];
    value: number[];
}

export class StatsApi {
    private restApi: RestApi;

    constructor(restApi: RestApi) {
        this.restApi = restApi;
    }

    getQueryLabels(): Promise<QueryLabelsDto | void> {
        return this.restApi.get<QueryLabelsDto>(process.env.NEXT_PUBLIC_API_PATH_STATS_LABELS as string, null);
    }

    getTimeSeries(query: StatsQueryDto): Promise<StatsTimeSeriesDto[] | void> {
        return this.restApi.get<StatsTimeSeriesDto[]>(process.env.NEXT_PUBLIC_API_PATH_STATS_TIME_SERIES as string, query);
    }
}