import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Room } from "./room.entity";
import { User } from "./user.entity";

@Index("fk_reservation_room_id", ["roomId"], {})
@Index("fk_reservation_user_id", ["userId"], {})
@Entity("reservation", { schema: "hotel" })
export class Reservation {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "reservation_id",
    unsigned: true,
  })
  reservationId: number;

  @Column("int", { name: "room_id", unsigned: true, default: () => "'0'" })
  roomId: number;

  @Column("enum", {
    name: "status",
    enum: ["prihvaceno", "odbijeno", "na cekanju"],
    default: () => "'na cekanju'",
  })
  status: "prihvaceno" | "odbijeno" | "na cekanju";

  @Column("int", { name: "user_id", unsigned: true, default: () => "'0'" })
  userId: number;

  @ManyToOne(() => Room, (room) => room.reservations, {
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "room_id", referencedColumnName: "roomId" }])
  room: Room;

  @ManyToOne(() => User, (user) => user.reservations, {
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;
}
