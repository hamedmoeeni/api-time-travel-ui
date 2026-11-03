export interface RoutingViewModel {
    id: string,
    priority: number,
    sourceHost: string[],
    sourcePath: string[],
    method: string[],
    destinationHostUri: string
}

