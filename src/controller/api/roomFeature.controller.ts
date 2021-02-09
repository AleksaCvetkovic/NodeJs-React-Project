import { Controller } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { RoomFeature } from "src/entities/roomFeature.entity";
import { RoomFeatureService } from "src/services/room-feature/room.feature";

@Controller('api/roomFeatures')
@Crud({
    model: {
        type: RoomFeature
    },
    params: {
        id: {
            field: 'roomFeatureId',
            type: 'number',
            primary: true
        }
    },
    query: {
        join: {
            room: {
                eager: true
            },
        }
    },
})
export class RoomFeatureController {
    constructor(public service: RoomFeatureService){ }
}