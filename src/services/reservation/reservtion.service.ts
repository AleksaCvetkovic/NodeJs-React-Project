import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Reservation } from "src/entities/reservation.entity";
import { Room } from "src/entities/room.entity";
import { Repository } from "typeorm";

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservation: Repository<Reservation>,
    @InjectRepository(Room)
    private readonly room: Repository<Room>,
  ) {}
    

}