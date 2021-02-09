
import * as Validator from 'class-validator';
export class editAdministratorDto{
   
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(8,128)
    password: string;
}