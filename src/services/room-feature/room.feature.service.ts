import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { RoomFeature } from "src/entities/roomFeature.entity";
import { Repository } from "typeorm";

@Injectable()
export class RoomFeatureService extends TypeOrmCrudService<RoomFeature>{
    constructor(@InjectRepository(RoomFeature) private readonly roomfeature: Repository<RoomFeature>){
        super(roomfeature);
    }
}