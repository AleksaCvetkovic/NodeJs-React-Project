import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("uq_administrator_username", ["username"], { unique: true })
@Entity("administrator", { schema: "hotel" })
export class Administrator {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "administrator_id",
    unsigned: true,
  })
  administratorId: number;

  @Column("varchar", {
    name: "username",
    unique: true,
    length: 128,
    default: () => "'0'",
  })
  username: string;

  @Column("varchar", {
    name: "passwordHash",
    length: 255,
    default: () => "'0'",
  })
  passwordHash: string;
}
