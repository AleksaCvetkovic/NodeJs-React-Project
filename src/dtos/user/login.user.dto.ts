import * as Validator from 'class-validator';
export class loginUserDto{
    @Validator.IsEmail({
        allow_ip_domain: false,
        allow_utf8_local_part: true,
        require_tld: true,
      })
      @Validator.IsNotEmpty()
    email:string;
    @Validator.IsNotEmpty()
   @Validator.IsString()
   @Validator.Length(8,128)
    password:string;
}