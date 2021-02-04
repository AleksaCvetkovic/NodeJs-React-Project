import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Room } from "./room.entity";

@Index("uq_photo_image_path", ["imagePath"], { unique: true })
@Index("fk_photo_room_id", ["roomId"], {})
@Entity("photo", { schema: "hotel" })
export class Photo {
  @PrimaryGeneratedColumn({ type: "int", name: "photo_id", unsigned: true })
  photoId: number;

  @Column("int", { name: "room_id", unsigned: true, default: () => "'0'" })
  roomId: number;

  @Column("varchar", {
    name: "image_path",
    unique: true,
    length: 255,
    default: () => "'0'",
  })
  imagePath: string;

  @ManyToOne(() => Room, (room) => room.photos, {
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "room_id", referencedColumnName: "roomId" }])
  room: Room;
}
