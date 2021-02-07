import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Room } from "src/entities/room.entity";
import { Repository } from "typeorm";

@Injectable()
export class  RoomService extends TypeOrmCrudService<Room> {
    constructor(@InjectRepository(Room) private readonly room: Repository<Room>,
    
    ) { 
             super(room); 
    }
}