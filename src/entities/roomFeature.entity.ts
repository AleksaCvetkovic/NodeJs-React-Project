import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Feature } from "./feature.entity";
import { Room } from "./room.entity";

@Index("uq_room_feature_room_id_feature_id", ["roomId", "featureId"], {
  unique: true,
})
@Index("fk_room_feature_feature_id", ["featureId"], {})
@Entity("room_feature", { schema: "hotel" })
export class RoomFeature {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "room_feature_id",
    unsigned: true,
  })
  roomFeatureId: number;

  @Column("int", { name: "room_id", unsigned: true, default: () => "'0'" })
  roomId: number;

  @Column("varchar", { name: "value", length: 255, default: () => "'0'" })
  value: string;

  @Column("int", { name: "feature_id", unsigned: true, default: () => "'0'" })
  featureId: number;

  @ManyToOne(() => Feature, (feature) => feature.roomFeatures, {
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "feature_id", referencedColumnName: "featureId" }])
  feature: Feature;

  @ManyToOne(() => Room, (room) => room.roomFeatures, {
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "room_id", referencedColumnName: "roomId" }])
  room: Room;
}
