import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from "express";
import { Reflector } from "@nestjs/core";

@Injectable()
export class roleChekerGard implements CanActivate {
    constructor(private reflektor: Reflector){ }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      const req: Request =  context.switchToHttp().getRequest();
      const role = req.token.role;
      
        const allowdToRoles = 
        this
        .reflektor
        .get<("administrator" | "user")[]>('allow_to_roles',context.getHandler());

        if(!allowdToRoles.includes(role)){
            return false;
        }
        return true;


    }

}