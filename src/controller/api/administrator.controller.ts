import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { addAdministratorDto } from "src/dtos/administrator/add.administrator.dto";
import { editAdministratorDto } from "src/dtos/administrator/edit.administrator.dto";
import { Administrator } from "src/entities/administrator.entity";
import { ApiResponse } from "src/misk/api.response.class";
import { AdministratorService } from "src/services/administrator/administrator.service";

@Controller('api/administrator')
export class administratorController {
    constructor(private administratorService: AdministratorService){ }

@Get()
getAllAdmins(): Promise<Administrator[]>{
    return this.administratorService.getAll();
}
@Get(':id')
getAById( @Param('id') administratorId:number): Promise<Administrator | ApiResponse>{
    return new Promise(async (resolve) => {
        const admin = await this.administratorService.getById(administratorId);
          if(admin === undefined){
            resolve(new ApiResponse("error", -1002));
          }
          resolve(admin);
        });
}
@Put()
add(@Body() data: addAdministratorDto): Promise<Administrator | ApiResponse>{
    return this.administratorService.add(data);
}
@Post(':id')
edit(@Param(':id') id:number, @Body() data: editAdministratorDto):Promise<Administrator | ApiResponse>{
    return this.administratorService.editById(id,data);
}
}

