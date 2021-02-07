import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { AddRoomDto } from "src/dtos/room/add.room.dto";
import { Room } from "src/entities/room.entity";
import { RoomFeature } from "src/entities/roomFeature.entity";
import { RoomPrice } from "src/entities/roomPrice.entity";

import { ApiResponse } from "src/misk/api.response.class";
import { Repository } from "typeorm";

@Injectable()
export class  RoomService extends TypeOrmCrudService<Room> {
    roomPrice: any;
    constructor(@InjectRepository(Room) private readonly room: Repository<Room>,
    @InjectRepository(RoomPrice)
    private readonly roomPrices: Repository<RoomPrice>,

    @InjectRepository(RoomFeature)
    private readonly roomFeatures: Repository<RoomFeature>,

    ) { 
             super(room); 
    }
    async createFullRoom(data: AddRoomDto): Promise<Room | ApiResponse>{
        const newRoom: Room = new Room();
        newRoom.name = data.name;
        newRoom.except = data.except;
        newRoom.description = data.description;
        newRoom.imagePath = data.imagePath;

        let saveRoom = await this.room.save(newRoom);

       let newRoomPrice = new RoomPrice();
        newRoomPrice.roomId = saveRoom.roomId;
        newRoomPrice.price = data.price;

        this.roomPrices.save(newRoomPrice);

        for( const feature of data.features) {
            let newRoomFeature: RoomFeature = new RoomFeature();
            newRoomFeature.roomId = saveRoom.roomId;
            newRoomFeature.name     = feature.name;

             await this.roomFeatures.save(newRoomFeature);
        
        }  

        return await this.room.findOne(saveRoom.roomId, {
            relations: [
                "roomFeatures",
                "roomPrices"
            ]
        });
    }
}