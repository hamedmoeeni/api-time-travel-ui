import {RoutingDto} from "@/src/lib/routingApi";
import {RoutingViewModel} from "./RoutingViewModel";


export class RoutingMapper {

    static mapFromDto (dto: RoutingDto): RoutingViewModel {
        return {
            ...dto,
            sourceHost: dto.sourceHost?.split(","),
            sourcePath: dto.sourcePath?.split(","),
            method: dto.method?.split(",")
        };
    }

    static mapToDto(record: RoutingViewModel): RoutingDto {
        return {
            ...record,
            sourceHost: record.sourceHost?.join(","),
            sourcePath: record.sourcePath?.join(","),
            method: record.method?.join(",")
        }
    }
}