/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrator } from 'src/entities/administrator.entity';
import { Repository } from 'typeorm';
import { addAdministratorDto } from 'src/dtos/administrator/add.administrator.dto';
import { editAdministratorDto } from 'src/dtos/administrator/edit.administrator.dto';
import * as crypto from 'crypto';
import { ApiResponse } from 'src/misk/api.response.class';
import { AdministratorToken } from 'src/entities/administrator-token';


@Injectable()
export class AdministratorService {
  constructor(
    @InjectRepository(AdministratorToken)
    private readonly administratorToken: Repository<AdministratorToken>,

    @InjectRepository(Administrator)
    private readonly administrator: Repository<Administrator>,
  ) {}

  getAll(): Promise<Administrator[]> {
    return this.administrator.find();
  }
  async getByUsername(username: string): Promise<Administrator | null>{
    const admin = await this.administrator.findOne({
        username: username
    });

    if (admin){
        return admin;
    }
    return null;

}

  getById(id: number): Promise<Administrator> {
    return this.administrator.findOne(id);
  }

  add(data: addAdministratorDto): Promise<Administrator | ApiResponse> {
    const passwordHash = crypto.createHash('sha512');
    passwordHash.update(data.password);
    const passwordHashString = passwordHash.digest('hex').toUpperCase();
    
    let newAdmin: Administrator = new Administrator();
    newAdmin.username = data.username;
    newAdmin.passwordHash = passwordHashString;

    return new Promise((resolve) =>{
      this.administrator.save(newAdmin)
      .then(data => resolve(data))
      .catch(error => {
          const response: ApiResponse = new ApiResponse("error", -1001);
          resolve(response);
      });
  });
  }
  async editById(
    id: number,
    data: editAdministratorDto,
  ): Promise<Administrator | ApiResponse> {
    let admin: Administrator = await this.administrator.findOne(id);
    if(admin === undefined){
      return new Promise((resolve) => {
          resolve(new ApiResponse("error", -1002));
      });

  }
  
    const passwordHash = crypto.createHash('sha512');
    passwordHash.update(data.password);
    const passwordHashString = passwordHash.digest('hex').toUpperCase();

    admin.passwordHash = passwordHashString;
    return this.administrator.save(admin);
  }
  async addToken(administratorId: number, token: string, expiresAt:string){
    const administratorToken = new AdministratorToken();
    administratorToken.administratorId = administratorId;
    administratorToken.token = token;
    administratorToken.expiresAt = expiresAt;

    return await this.administratorToken.save(administratorToken);
}

async getAdministratorToken(token: string): Promise<AdministratorToken>{
    return await this.administratorToken.findOne({
        token: token,
    });
}

async invalidateToken( token: string ): Promise<AdministratorToken | ApiResponse>{
  const administratorToken =  await this.administratorToken.findOne({
      token: token,
  });
  if(!administratorToken){
      return new ApiResponse('error', -10001, ' no such token');
  }

  administratorToken.isValid = 0;
  await this.administratorToken.save(administratorToken);

  return await this.getAdministratorToken(token);

}

async invalidateAdministratorTokens(administratorId: number){

  const administratorTokens = await this.administratorToken.find({
      administratorId: administratorId,
  });

  const resoults = [];
  for (const administratorToken of administratorTokens){
  resoults.push(this.invalidateToken(administratorToken.token));
}
return resoults;
}
}
