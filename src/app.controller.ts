import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get() //http://localhost : 3000/
  getHello(): string {
    return 'hello';
  }
  @Get('world') //http://localhost : 3000/world/
  getHelloWorld(): string {
    return 'hello world';
  }
}
