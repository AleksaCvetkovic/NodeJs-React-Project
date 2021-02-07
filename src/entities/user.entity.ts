import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Reservation } from "./reservation.entity";

@Index("uq_user_email", ["email"], { unique: true })
@Entity("user", { schema: "hotel" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "user_id", unsigned: true })
  userId: number;

  @Column("varchar", {
    name: "email",
    unique: true,
    length: 128,
    default: () => "'0'",
  })
  email: string;

  @Column("varchar", {
    name: "passwordHash",
    length: 128,
    default: () => "'0'",
  })
  passwordHash: string;

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];
}
