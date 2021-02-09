import { Body, Controller, Get, Param, Patch, Post, Put, UseGuards } from "@nestjs/common";
import { addAdministratorDto } from "src/dtos/administrator/add.administrator.dto";
import { editAdministratorDto } from "src/dtos/administrator/edit.administrator.dto";
import { Administrator } from "src/entities/administrator.entity";
import { AllowToRoles } from "src/misk/allow.to.roles.descriptor";
import { ApiResponse } from "src/misk/api.response.class";
import { roleChekerGard } from "src/misk/role.cheker.gard";
import { AdministratorService } from "src/services/administrator/administrator.service";

@Controller('api/administrator')
export class administratorController {
    constructor(private administratorService: AdministratorService){ }

@Get()
@AllowToRoles('administrator')
getAllAdmins(): Promise<Administrator[]>{
    return this.administratorService.getAll();
}
@Get(':id')
@AllowToRoles('administrator')
getAById( @Param('id') administratorId:number): Promise<Administrator | ApiResponse>{
    return new Promise(async (resolve) => {
        const admin = await this.administratorService.getById(administratorId);
          if(admin === undefined){
            resolve(new ApiResponse("error", -1002));
          }
          resolve(admin);
        });
}
@Post()
@AllowToRoles('administrator')
add(@Body() data: addAdministratorDto): Promise<Administrator | ApiResponse>{
    return this.administratorService.add(data);
}
@Patch(':id')
@AllowToRoles('administrator')
edit(@Param(':id') id:number, @Body() data: editAdministratorDto):Promise<Administrator | ApiResponse>{
    return this.administratorService.editById(id,data);
}
}

