import * as Validator from 'class-validator';
export class RoomSearchFeatureComponentDto{
    roomFeatureId: number;

    @Validator.IsNotEmpty({each: true})
    @Validator.IsString({each: true})
    @Validator.Length(1,255,{each:true})
        name: string[];
}