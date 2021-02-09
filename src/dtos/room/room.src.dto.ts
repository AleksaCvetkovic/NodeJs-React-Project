import * as Validator from 'class-validator';
import { RoomSearchFeatureComponentDto } from './room.src.feature.component.dto';
export class RoomSearcbDto{
    @Validator.IsOptional()
    @Validator.IsString()
    @Validator.Length(2, 128)
    keywords: string;

    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 2,
    })
    @Validator.IsOptional()
    priceMin:number;

    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 2,
    })
    @Validator.IsOptional()
    priceMax: number;

    
    features: RoomSearchFeatureComponentDto[];
    @Validator.IsOptional()

    orderBy: 'name' | 'price';

    orderDirection: 'ASC' | 'DESC';
    @Validator.IsOptional()
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces:0,

    })
    page: number;
    @Validator.IsOptional()
    @Validator.IsIn([5,10,15,20,25])
    itemsPerPage: 5 | 10 | 15 | 20 | 25 | 40;

}