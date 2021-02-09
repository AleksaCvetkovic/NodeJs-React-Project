import { Body, Controller, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
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
@UseGuards(roleChekerGard)
@AllowToRoles('administrator')
getAllAdmins(): Promise<Administrator[]>{
    return this.administratorService.getAll();
}
@Get(':id')
@UseGuards(roleChekerGard)
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
@Put()
@UseGuards(roleChekerGard)
@AllowToRoles('administrator')
add(@Body() data: addAdministratorDto): Promise<Administrator | ApiResponse>{
    return this.administratorService.add(data);
}
@Post(':id')
@UseGuards(roleChekerGard)
@AllowToRoles('administrator')
edit(@Param(':id') id:number, @Body() data: editAdministratorDto):Promise<Administrator | ApiResponse>{
    return this.administratorService.editById(id,data);
}
}

