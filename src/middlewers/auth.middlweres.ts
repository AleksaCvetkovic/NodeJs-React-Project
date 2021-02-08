import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AdministratorService } from "src/services/administrator/administrator.service";
import * as jwt from 'jsonwebtoken';
import { jwtDataDto } from "src/dtos/auth/jwt.data.dto";
import { jwtSecret } from "config/jwt.secret";


@Injectable()
export class AuthMiddleware implements NestMiddleware{
    constructor( private readonly administratorService: AdministratorService ){}

    async use(req: Request, res: Response, next: NextFunction) {
       if (!req.headers.authorization){
           throw new HttpException('tokenNotFound', HttpStatus.UNAUTHORIZED);
       }

       const token = req.headers.authorization;

       const tokenParts = token.split(' ');
       if(tokenParts.length !==2){
        throw new HttpException('tokenNotFound', HttpStatus.UNAUTHORIZED);
       }
       const tokenString = tokenParts[1];

       const jwtData: jwtDataDto = jwt.verify(tokenString, jwtSecret);
       if(!jwtData){
        throw new HttpException('badToken', HttpStatus.UNAUTHORIZED); 
       }

       const ip = req.ip.toString();

       if(jwtData.ip !== req.ip.toString()){
        throw new HttpException('badToken', HttpStatus.UNAUTHORIZED);
       }
       if(jwtData.ua !== req.headers["user-agent"]){
        throw new HttpException('badToken', HttpStatus.UNAUTHORIZED);
       }

       const administrator = await this.administratorService.getById(jwtData.administratorId);
       if(!administrator){
        throw new HttpException('acountNotFound', HttpStatus.UNAUTHORIZED);
       }

       const trenutniTimestamp = new Date().getTime()/1000;

       if(trenutniTimestamp >= jwtData.ext){
        throw new HttpException('expireToken', HttpStatus.UNAUTHORIZED);
       }

        next();
    }
    

   
}
    