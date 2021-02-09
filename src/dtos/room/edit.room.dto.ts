import * as Validator from 'class-validator';
import { RoomFeatureComponentDto } from './room.feature.component.dto';

export class EditRoomDto{
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(5,128) 
    name: string;
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(5,128)
    except: string;
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(64,10000)
    description: string;
    status: 'dostupna'|'nedostupna';
    @Validator.IsNotEmpty()
    @Validator.IsNumber({
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 2,
    })
    @Validator.IsPositive()
    price: string;


    @Validator.IsOptional()
    @Validator.IsArray()
    @Validator.ValidateNested({
        always:true,
    })
    features: RoomFeatureComponentDto[] | null;
}