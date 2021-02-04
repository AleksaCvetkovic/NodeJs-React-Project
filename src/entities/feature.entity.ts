import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoomFeature } from "./roomFeature.entity";

@Entity("feature", { schema: "hotel" })
export class Feature {
  @PrimaryGeneratedColumn({ type: "int", name: "feature_id", unsigned: true })
  featureId: number;

  @Column("varchar", { name: "name", length: 32, default: () => "'0'" })
  name: string;

  @OneToMany(() => RoomFeature, (roomFeature) => roomFeature.feature)
  roomFeatures: RoomFeature[];
}
