import { Body, Controller, HttpException, HttpStatus, Post, Put, Req } from "@nestjs/common";
import { loginAdministratorDto } from "src/dtos/administrator/login.administrator.dto";
import { ApiResponse } from "src/misk/api.response.class";
import { AdministratorService } from "src/services/administrator/administrator.service";
import * as crypto from 'crypto';
import { LoginInfoDto } from "src/dtos/auth/logininfo.dto";
import * as jwt from 'jsonwebtoken';
import { jwtDataDto } from "src/dtos/auth/jwt.data.dto";
import { Request } from "express";
import { jwtSecret } from "config/jwt.secret";
import { UserRegistrationDto } from "src/dtos/user/user.registration.dto";
import { UserService } from "src/services/user/user.service";
import { loginUserDto } from "src/dtos/user/login.user.dto";
import { jwtRefreshDataDto } from "src/dtos/auth/jwt.refresh.dto";
import { UserRefreshTokenDto } from "src/dtos/auth/user.refresh.token.dto";



@Controller('auth')
export class AuthController{
    constructor(public administratorSerice: AdministratorService,
        public userService: UserService,
        ){}

    @Post('administrator/login') //http://localhost300/auth/login
    async doAdministratorLogin(@Body() data: loginAdministratorDto,@Req() req: Request): Promise<LoginInfoDto | ApiResponse>{
        const administrator = await this.administratorSerice.getByUsername(data.username);

        if(!administrator){
            return new Promise(resolve =>{
                resolve(new ApiResponse('error', -3001))
            })
        }
            const passwordHash = crypto.createHash('sha512');
            passwordHash.update(data.password);
            const passwordHashString = passwordHash.digest('hex').toUpperCase();
        if (administrator.passwordHash !== passwordHashString){
            return new Promise (resolve => resolve(new ApiResponse('error', -3002)));
        }

        const jwtData = new jwtDataDto();
        jwtData.role = "administrator";
        jwtData.id = administrator.administratorId;
        jwtData.identity = administrator.username;

        
        jwtData.exp = this.getDatePlus(60 * 60 *24 * 31);

        jwtData.ip = req.ip.toString();
        jwtData.ua = req.headers["user-agent"];

        let token: string = jwt.sign(jwtData.toPlainObject(),jwtSecret);



        const responseObject = new LoginInfoDto(
            administrator.administratorId,
            administrator.username,
            token,
            "",
            ""
        );

        return new Promise(resolve => resolve(responseObject));
    }

    @Post('user/register')
    async userRegister(@Body() data: UserRegistrationDto){
        return await this.userService.register(data);
    }
    @Post('user/login') //http://localhost300/auth/login
    async doUserLogin(@Body() data: loginUserDto,@Req() req: Request): Promise<LoginInfoDto | ApiResponse>{
        const user = await this.userService.getByEmail(data.email);

        if(!user){
            return new Promise(resolve =>{
                resolve(new ApiResponse('error', -3001))
            })
        }
            const passwordHash = crypto.createHash('sha512');
            passwordHash.update(data.password);
            const passwordHashString = passwordHash.digest('hex').toUpperCase();
        if (user.passwordHash !== passwordHashString){
            return new Promise (resolve => resolve(new ApiResponse('error', -3002)));
        }

        const jwtData = new jwtDataDto();
        jwtData.role = "user";
        jwtData.id = user.userId;
        jwtData.identity = user.email;
        jwtData.exp = this.getDatePlus(60 * 5);
        jwtData.ip = req.ip.toString();
        jwtData.ua = req.headers["user-agent"];

        let token: string = jwt.sign(jwtData.toPlainObject(),jwtSecret);

        const jwtRefreshData = new jwtRefreshDataDto();
        jwtRefreshData.id = jwtData.id;
        jwtRefreshData.role = jwtData.role;
        jwtRefreshData.identity = jwtData.identity;
        jwtRefreshData.exp = this.getDatePlus(60 * 60 *24 * 31);
        jwtRefreshData.ip = jwtData.ip;
        jwtRefreshData.ua = jwtData.ua;

        let refresToken: string = jwt.sign(jwtRefreshData.toPlainObject(),jwtSecret);

        const responseObject = new LoginInfoDto(
            user.userId,
            user.email,
            token,
            refresToken,
            this.getIsoDate(jwtRefreshData.exp),
        );

        await this.userService.addToken(user.userId,
             refresToken,
              this.getDatabaseDateForam(this.getIsoDate(jwtRefreshData.exp)));

        return new Promise(resolve => resolve(responseObject));
    }
    @Post ('user/refresh')
    async userTokenRefresh(@Req() req: Request, @Body() data: UserRefreshTokenDto): Promise<LoginInfoDto | ApiResponse>{
        const userToken = await this. userService.getUserToken(data.token);

        if(!userToken){
           return new ApiResponse('error', -10002, 'no such token refresh');
        }           
        if(userToken.isValid === 0){
            return new ApiResponse('error', -10002, 'no such token refresh');
         }    
         const sada = new Date();
         const datumIsteka = new Date(userToken.expiresAt);

         if(datumIsteka.getTime() < sada.getTime()){
            return new ApiResponse('error', -10005, 'token expire');
         }

         let jwtRefreshData: jwtRefreshDataDto;

         try{
            jwtRefreshData = jwt.verify(data.token,jwtSecret);
         }catch(e){
             throw new HttpException('bad token found', HttpStatus.UNAUTHORIZED);
         }

         if(!jwtRefreshData){
            throw new HttpException('badToken', HttpStatus.UNAUTHORIZED); 
           }
    
    
           if(jwtRefreshData.ip !== req.ip.toString()){
            throw new HttpException('badToken', HttpStatus.UNAUTHORIZED);
           }
           if(jwtRefreshData.ua !== req.headers["user-agent"]){
            throw new HttpException('badToken', HttpStatus.UNAUTHORIZED);
           }
           const jwtData = new jwtDataDto();
        jwtData.role = jwtRefreshData.role;
        jwtData.id = jwtRefreshData.id;
        jwtData.identity = jwtRefreshData.identity;
        jwtData.exp = this.getDatePlus(60 * 5);
        jwtData.ip = jwtRefreshData.ip;
        jwtData.ua = jwtRefreshData.ua;

        let token: string = jwt.sign(jwtData.toPlainObject(),jwtSecret);
        const responseObject = new LoginInfoDto(
            jwtData.id,
            jwtData.identity,
            token,
            data.token,
            this.getIsoDate(jwtRefreshData.exp),
        );
        return responseObject;
        
        }

    private getDatePlus(numberOfSecounds: number): number{
        return new Date().getTime() /1000 + numberOfSecounds;
    }

    private getIsoDate(timestemp: number){
        const date = new Date();
        date.setTime(timestemp * 1000);
        return date.toISOString();
    }
    
    private getDatabaseDateForam(IsoFromat: string): string {

        return IsoFromat.substr( 0 ,19).replace('T', ' ');

    }
}