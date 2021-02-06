/* eslint-disable prettier/prettier */
import { Controller, Get, Param } from '@nestjs/common';
import { AdministratorService } from '../../services/administrator/administrator.service';

@Controller()
export class AppController {
  constructor(private administratorServices: AdministratorService) {}
  @Get() //http://localhost:3000/
  getIndex(): string {
    return 'home page';
  }
 
}
