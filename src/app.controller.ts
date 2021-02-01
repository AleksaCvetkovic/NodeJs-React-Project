import { Controller, Get } from '@nestjs/common';
import { Administrator } from './entities/administrator.entities';
import { AdministratorService } from './services/administrator/administrator.service';

@Controller()
export class AppController {
  constructor(
    private administratorServices: AdministratorService
  ){}
  @Get() //http://localhost:3000/
  getIndex():string {
    return 'home page';
  }
  @Get('api/administrator') //http://localhost:3000/api/administrator/
  getAllAdmins(): Promise<Administrator[]>{
    return this.administratorServices.getAll();
  }
}
