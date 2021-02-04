import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Room } from "./room.entity";

@Index("fk_room_price_room_id", ["roomId"], {})
@Entity("room_price", { schema: "hotel" })
export class RoomPrice {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "room_price_id",
    unsigned: true,
  })
  roomPriceId: number;

  @Column("int", { name: "room_id", unsigned: true, default: () => "'0'" })
  roomId: number;

  @Column("decimal", {
    name: "price",
    unsigned: true,
    precision: 10,
    scale: 2,
    default: () => "'0.00'",
  })
  price: string;

  @ManyToOne(() => Room, (room) => room.roomPrices, {
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "room_id", referencedColumnName: "roomId" }])
  room: Room;
}
