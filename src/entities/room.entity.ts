import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Photo } from "./photo.entity";
import { Reservation } from "./reservation.entity";
import { RoomFeature } from "./roomFeature.entity";
import { RoomPrice } from "./roomPrice.entity";

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
  except: string;

  @Column("varchar", { name: "image_path", length: 255, default: () => "'0'" })
  imagePath: string;

  @Column("varchar", { name: "description", length: 255, default: () => "'0'" })
  description: string;

  @OneToMany(() => Photo, (photo) => photo.room)
  photos: Photo[];

  @OneToMany(() => Reservation, (reservation) => reservation.room)
  reservations: Reservation[];

  @OneToMany(() => RoomFeature, (roomFeature) => roomFeature.room)
  roomFeatures: RoomFeature[];

  @OneToMany(() => RoomPrice, (roomPrice) => roomPrice.room)
  roomPrices: RoomPrice[];
}
