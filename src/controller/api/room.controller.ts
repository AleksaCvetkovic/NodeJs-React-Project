import { Body, Controller, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Crud } from "@nestjsx/crud";
import { AddRoomDto } from "src/dtos/room/add.room.dto";
import { Room } from "src/entities/room.entity";
import { RoomService } from "src/services/room/room.service";
import { diskStorage } from "multer";
import { StorageConfig } from "config/storage.config";
import { Photo } from "src/entities/photo.entity";
import { PhotoService } from "src/services/photo/photos.service";
import { ApiResponse } from "src/misk/api.response.class";




@Controller('api/room')
@Crud({
    model: {
        type: Room
    },
    params: {
        id: {
            field: 'roomId',
            type: 'number',
            primary: true
        }
    },
    query: {
        join: {
            photos: {
                eager: true
            },
            roomPrices: {
                eager: true
            },
            roomFeatures: {
                eager: true
            },
        }
    },
})
export class roomController {
    constructor(
        public service: RoomService,
        public photoService: PhotoService){ }
        @Post('createfullRoom')
        createFullRoom(@Body() data: AddRoomDto){
            return this.service.createFullRoom(data);
        }
        @Post(':id/uploadPhoto')
        @UseInterceptors(
            FileInterceptor('photo', {
                storage:diskStorage({
                    destination: StorageConfig.photoDestination,
                    filename: (req, file, callback) => {
                        let original = file.originalname;

                        let normalized = original.replace(/\s+/g,'-');
                        normalized = normalized.replace(/[^A-z0-9\.\-]/g, '');
                        let sada = new Date();
                        let datePart = '';
                        datePart += sada.getUTCFullYear().toString();
                        datePart += (sada.getMonth()+ 1).toString();
                        datePart += sada.getDate().toString();

                        let randomPart: string =
                        new Array(10)
                        .fill(0)
                        .map(e => (Math.random()*10).toFixed(0).toString())
                        .join('');

                        let filename = datePart + '-' + randomPart + '-' + normalized;

                        filename = filename.toLocaleLowerCase();

                        callback(null, filename);
                    }

                }),
                fileFilter: (req, file, callback) =>{
                    if(!file.originalname.match(/\.(jpg|png)$/)){
                        callback(new Error('Bad file extension'), false);
                        return;
                    }
                    if(!(file.mimetype.includes('jpeg') || file.mimetype.includes('pmg'))){
                        callback(new Error('Bad file content'), false);
                        return;
                    }
                    callback(null, true);
                },
                limits: {
                    files: 1,
                    fileSize: StorageConfig.photoMaxFileSize
                }
            })
        )
       async uploadPhoto(@Param('id') roomId: number, @UploadedFile() photo): Promise<ApiResponse | Photo>{

            const newPhoto: Photo = new Photo();
            newPhoto.roomId = roomId;
            newPhoto.imagePath = photo.filename;

           const savePhoto = await this.photoService.add(newPhoto);

           if(!savePhoto){
               return new ApiResponse('error', -4001);
           }
           return savePhoto;
        }
    }