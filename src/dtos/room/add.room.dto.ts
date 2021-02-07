import { RoomFeature } from "src/entities/roomFeature.entity";

export class AddRoomDto{
    name: string;
    except: string;
    description: string;
    price: string;
    imagePath: string;
    features: {
        name:string;
        featureId:number;
    }[];
}