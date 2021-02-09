import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Photo } from "./photo.entity";
import { Reservation } from "./reservation.entity";
import { RoomFeature } from "./roomFeature.entity";
import { RoomPrice } from "./roomPrice.entity";
import * as Validator from 'class-validator';

@Entity("room", { schema: "hotel" })
export class Room {
  @PrimaryGeneratedColumn({ type: "int", name: "room_id", unsigned: true })
  roomId: number;

  @Column("enum", {
    name: "status",
    enum: ["dostupna", "nedostupna"],
    default: () => "'dostupna'",
  })
  status: "dostupna" | "nedostupna";

  @Column("varchar", { name: "except", length: 128, default: () => "'0'" })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(5,128)
  except: string;

  @Column("varchar", { name: "image_path", length: 255, default: () => "'0'" })
  imagePath: string;

  @Column("varchar", { name: "description" })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(64,10000)
  description: string;

  @Column("text", { name: "name", nullable: true })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(5,255)

  name: string | null;

  @OneToMany(() => Photo, (photo) => photo.room)
  photos: Photo[];

  @OneToMany(() => Reservation, (reservation) => reservation.room)
  reservations: Reservation[];

  @OneToMany(() => RoomFeature, (roomFeature) => roomFeature.room)
  roomFeatures: RoomFeature[];

  @OneToMany(() => RoomPrice, (roomPrice) => roomPrice.room)
  roomPrices: RoomPrice[];
}
