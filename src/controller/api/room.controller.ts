import { Controller } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Room } from "src/entities/room.entity";
import { RoomService } from "src/services/room/room.service";

@Controller('api/room')
@Crud({
    model: {
        type: Room
    },
    params: {
        id: {
            field: 'room_id',
            type: 'number',
            primary: true
        }
    },
    query: {
        join: {
            photos: {
                eager: true
            },
            roomPrice: {
                eager: true
            },
            roomFeature: {
                eager: true
            }
        }
    },
})
export class roomController {
    constructor(public service: RoomService
               
                
        ){ }

    }