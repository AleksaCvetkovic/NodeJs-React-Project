import * as Validator from 'class-validator';
export class RoomFeatureComponentDto{
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(5,128) 
    name:string;
    
        featureId:number;
}