import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Room } from "./room.entity";

@Index("fk_room_feature_room_id", ["roomId"], {})
@Entity("room_feature", { schema: "hotel" })
export class RoomFeature {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "room_feature_id",
    unsigned: true,
  })
  roomFeatureId: number;

  @Column("varchar", { name: "name", length: 128, default: () => "'0'" })
  name: string;

  @Column("int", { name: "room_id", unsigned: true, default: () => "'0'" })
  roomId: number;

  @ManyToOne(() => Room, (room) => room.roomFeatures, {
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "room_id", referencedColumnName: "roomId" }])
  room: Room;
}
