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

@Injectable()
export class AdministratorService {
  constructor(
    @InjectRepository(Administrator)
    private readonly administrator: Repository<Administrator>,
  ) {}

  getAll(): Promise<Administrator[]> {
    return this.administrator.find();
  }
  async getByEmail(email: string): Promise<Administrator | null> {
    const admin = await this.administrator.findOne({
      email: email,
    });

    if (admin) {
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

    const newAdmin: Administrator = new Administrator();
    newAdmin.email = data.email;
    newAdmin.passwordHash = passwordHashString;

    return new Promise((resolve) => {
      this.administrator
        .save(newAdmin)
        .then((data) => resolve(data))
        .catch((error) => {
          const response: ApiResponse = new ApiResponse('error', -1001);
        });
    });
  }
  async editById(
    id: number,
    data: editAdministratorDto,
  ): Promise<Administrator | ApiResponse> {
    const admin: Administrator = await this.administrator.findOne(id);

    if (admin === undefined) {
      return new Promise((resolve) => {
        resolve(new ApiResponse('error', -1002));
      });
    }

    const passwordHash = crypto.createHash('sha521');
    passwordHash.update(data.password);
    const passwordHashString = passwordHash.digest('hex').toUpperCase();

    admin.passwordHash = passwordHashString;
    return this.administrator.save(admin);
  }
}
