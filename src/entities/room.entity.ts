import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Photo } from "./photo.entity";
import { Reservation } from "./reservation.entity";
import { RoomFeature } from "./roomFeature.entity";
import { RoomPrice } from "./roomPrice.entity";

@Index("uq_room_name", ["name"], { unique: true })
@Index("uq_room_image_path", ["imagePath"], { unique: true })
@Entity("room", { schema: "hotel" })
export class Room {
  @PrimaryGeneratedColumn({ type: "int", name: "room_id", unsigned: true })
  roomId: number;

  @Column("varchar", {
    name: "name",
    unique: true,
    length: 50,
    default: () => "'0'",
  })
  name: string;

  @Column("varchar", {
    name: "image_path",
    unique: true,
    length: 128,
    default: () => "'0'",
  })
  imagePath: string;

  @Column("varchar", { name: "except", length: 255, default: () => "'0'" })
  except: string;

  @Column("text", { name: "description" })
  description: string;

  @Column("enum", {
    name: "status",
    enum: ["dostupno", "zauzeto"],
    default: () => "'dostupno'",
  })
  status: "dostupno" | "zauzeto";

  @OneToMany(() => Photo, (photo) => photo.room)
  photos: Photo[];

  @OneToMany(() => Reservation, (reservation) => reservation.room)
  reservations: Reservation[];

  @OneToMany(() => RoomFeature, (roomFeature) => roomFeature.room)
  roomFeatures: RoomFeature[];

  @OneToMany(() => RoomPrice, (roomPrice) => roomPrice.room)
  roomPrices: RoomPrice[];
}
