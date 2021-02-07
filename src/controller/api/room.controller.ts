import { Body, Controller, Post } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { AddRoomDto } from "src/dtos/room/add.room.dto";
import { Room } from "src/entities/room.entity";
import { RoomService } from "src/services/room/room.service";

@Controller('api/room')
@Crud({
    model: {
        type: Room
    },
    params: {
        id: {
            field: 'roomId',
            type: 'number',
            primary: true
        }
    },
    query: {
        join: {
            photos: {
                eager: true
            },
            roomPrices: {
                eager: true
            },
            roomFeatures: {
                eager: true
            },
        }
    },
})
export class roomController {
    constructor(public service: RoomService){ }
        @Post('createfullRoom')
        createFullRoom(@Body() data: AddRoomDto){
            return this.service.createFullRoom(data);
        }
    }