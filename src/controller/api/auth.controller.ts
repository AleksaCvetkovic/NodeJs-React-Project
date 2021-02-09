import { Body, Controller, Post, Req } from "@nestjs/common";
import { loginAdministratorDto } from "src/dtos/administrator/login.administrator.dto";
import { ApiResponse } from "src/misk/api.response.class";
import { AdministratorService } from "src/services/administrator/administrator.service";
import * as crypto from 'crypto';
import { LoginInfoDto } from "src/dtos/auth/logininfo.dto";
import * as jwt from 'jsonwebtoken';
import { jwtDataDto } from "src/dtos/auth/jwt.data.dto";
import { Request } from "express";
import { jwtSecret } from "config/jwt.secret";



@Controller('auth')
export class AuthController{
    constructor(public administratorSerice: AdministratorService){}

    @Post('login') //http://localhost300/auth/login
    async doLogin(@Body() data: loginAdministratorDto,@Req() req: Request): Promise<LoginInfoDto | ApiResponse>{
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
        jwtData.administratorId = administrator.administratorId;
        jwtData.username = administrator.username;
        let sada = new Date();
        sada.setDate(sada.getDate()+14);
        const istekTimestemp = sada.getTime() /1000;
        jwtData.exp = istekTimestemp;

        jwtData.ip = req.ip.toString();
        jwtData.ua = req.headers["user-agent"];

        let token: string = jwt.sign(jwtData.toPlainObject(),jwtSecret);

        const responseObject = new LoginInfoDto(
            administrator.administratorId,
            administrator.username,
            token
        );

        return new Promise(resolve => resolve(responseObject));
    }
}