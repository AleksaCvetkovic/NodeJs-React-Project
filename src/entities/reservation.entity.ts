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

@Index("uq_reservation_user_id_room_id", ["userId", "roomId"], { unique: true })
@Index("fk_reservation_room_id", ["roomId"], {})
@Entity("reservation", { schema: "hotel" })
export class Reservation {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "reservation_id",
    unsigned: true,
  })
  reservationId: number;

  @Column("int", { name: "user_id", unsigned: true, default: () => "'0'" })
  userId: number;

  @Column("int", { name: "room_id", unsigned: true, default: () => "'0'" })
  roomId: number;

  @Column("enum", {
    name: "status",
    enum: ["prihvaceno", "odbijeno", "poslato", "razmatramo"],
    default: () => "'razmatramo'",
  })
  status: "prihvaceno" | "odbijeno" | "poslato" | "razmatramo";

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
