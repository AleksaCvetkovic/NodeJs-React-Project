import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { AddRoomDto } from "src/dtos/room/add.room.dto";
import { EditRoomDto } from "src/dtos/room/edit.room.dto";
import { RoomSearcbDto } from "src/dtos/room/room.src.dto";
import { Room } from "src/entities/room.entity";
import { RoomFeature } from "src/entities/roomFeature.entity";
import { RoomPrice } from "src/entities/roomPrice.entity";

import { ApiResponse } from "src/misk/api.response.class";
import { In, Repository } from "typeorm";

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
    async search(data: RoomSearcbDto): Promise<Room[]> {
       const builder = await this.room.createQueryBuilder("room");

       builder.leftJoinAndSelect("room.roomFeature","ar");

       builder.innerJoinAndSelect("room.roomPrices", "ap");

       if (data.keywords && data.keywords.length > 0){
           builder.andWhere('room.name LIKE :kw OR room.exept LIKE :kw OR room.desription LIKE :kw OR',{kw:'%' + data.keywords.trim() + '%'});
       }
       if (data.priceMin && typeof data.priceMin === 'number'){
           builder.andWhere('ap.price >= :min', {min: data.priceMin});
       }
       if ( data.priceMax && typeof data.priceMax === 'number'){
        builder.andWhere('ap.price <= :max', {min: data.priceMax});
    }

    if(data.features && data.features.length > 0){
        for(const features of data.features ){
            builder.andWhere('ar.featureId = :fid  AND ar name IN (:fVals)',
                {
                    fid: features.roomFeatureId,
                    fVals: features.name,
                });
            }
        }

        let orderBy = 'roomId.name';
        let orderDirection : 'ASC' | 'DESC' = 'ASC';

        if(data.orderBy){
            orderBy = data.orderBy;

            if(orderBy === 'price'){
                orderBy = 'ap.price';
            }

            if(orderBy === 'name'){
                orderBy = 'room.name';
            }
        }
        if(data.orderDirection){
            orderDirection  = data.orderDirection;
        }

        builder.orderBy(orderBy, orderDirection);
        let page = 0;
        let perPage = 5 | 10 | 15 | 20 | 25 | 40;

        if(data.page && typeof data.page === 'number'){
            page = data.page;
        }
        
        if( data.itemsPerPage && typeof data.itemsPerPage === 'number'){
            perPage = data.itemsPerPage;
        }

        builder.skip(page * perPage);
        builder.take(perPage);
        
        let roomIds = await (await (builder.getMany())).map(room => room.roomId);

        return await this.room.find({
            where: { roomId: In(roomIds) },
            relations: [
                "roomFeatures",
                "roomPrices"
            ]
        });
    }
}