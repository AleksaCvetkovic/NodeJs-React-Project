import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { AddRoomDto } from "src/dtos/room/add.room.dto";
import { EditRoomDto } from "src/dtos/room/edit.room.dto";
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

        for( let features of data.features) {
            let newRoomFeature: RoomFeature = new RoomFeature();
            newRoomFeature.roomId = saveRoom.roomId;
            newRoomFeature.name     = features.name;

             await this.roomFeatures.save(newRoomFeature);
        
        }  

        return await this.room.findOne(saveRoom.roomId, {
            relations: [
                "roomFeatures",
                "roomPrices"
            ]
        });
    }

    async editFullRoom(roomId: number, data: EditRoomDto): Promise<Room | ApiResponse>{
        const existingRoom: Room = await this.room.findOne(roomId, {
            relations: ['roomPrices', 'roomFeatures']
        });

        if(!existingRoom){
            return new ApiResponse('error', -5001,'Room not found');
        }

        existingRoom.name        = data.name;
        existingRoom.description = data.description;
        existingRoom.except      = data.except;
        existingRoom.status      = data.status;

        const saveRoom = await this.room.save(existingRoom);

        if(!saveRoom){
            return new ApiResponse('error', -5002,'we cant save this room sorry');
        }

        const newPrice: string = Number(data.price).toFixed(2);

        const lastPrice = existingRoom.roomPrices[existingRoom.roomPrices.length -1].price;
        const lastPriceString: string = Number(lastPrice).toFixed(2);

        if(newPrice !== lastPriceString){
            const newRoomPrice = new RoomPrice();
            newRoomPrice.roomId = roomId;
            newRoomPrice.price = data.price;

            const saveRoomPrice = await this.roomPrice.save(newRoomPrice);

            if(!saveRoomPrice){
                return new ApiResponse('error', -5003,'we cant save new room price ');

            }
        }
        if(data.features !== null){
            await this.roomFeatures.remove(existingRoom.roomFeatures);

            for( let features of data.features) {
                let newRoomFeature: RoomFeature = new RoomFeature();
                newRoomFeature.roomId = roomId;
                newRoomFeature.name     = features.name;
    
                 await this.roomFeatures.save(newRoomFeature);
            
            }  
        }

        return await this.room.findOne(roomId, {
            relations: [
                "roomFeatures",
                "roomPrices"
            ]
        });

    }
}