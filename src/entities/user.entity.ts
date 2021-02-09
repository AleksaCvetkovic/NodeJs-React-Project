import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Reservation } from "./reservation.entity";
import * as Validator from 'class-validator';

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
  @Validator.IsEmail({
    allow_ip_domain: false,
    allow_utf8_local_part: true,
    require_tld: true,
  })
  @Validator.IsNotEmpty()
  email: string;

  @Column("varchar", {
    name: "passwordHash",
    length: 128,
    default: () => "'0'",
  })
  @Validator.IsString()
  @Validator.IsNotEmpty()
  @Validator.IsHash('sha512')
  passwordHash: string;

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];
}
