import { Body, Controller, Param, Post, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
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
import * as fileType from 'file-type';
import * as fs from 'fs';
import * as sharp from 'sharp';




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
                        req.filrFilterError = 'Bad file extension';
                        callback(null, false);
                        return;
                    }
                    if(!(file.mimetype.includes('jpeg') || file.mimetype.includes('pmg'))){
                        req.filrFilterError = 'Bad file content';
                        callback(null, false);
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
       async uploadPhoto(
           @Param('id') roomId: number, 
           @UploadedFile() photo,
           @Req() req 
           ): Promise<ApiResponse | Photo>{
               if(req.filrFilterError){
                   return new ApiResponse('error', -4002, req.filrFilterError);
               }

               if(!photo){
                return new ApiResponse('error', -4002, 'file not uplouded');
               }
               const fileTypeResoult = await fileType.fromFile(photo.path);
               if(!fileTypeResoult){
                    fs.unlinkSync(photo.path);
                return new ApiResponse('error', -4002, 'file not connot detect');
               }
               const realMimeType =   fileTypeResoult.mime;

               if(!(realMimeType.includes('jpeg') || realMimeType.includes('pmg'))){
                fs.unlinkSync(photo.path);
               
                return new ApiResponse('error', -4002, 'file not connot detect');
               }

               await this.createThumb(photo);
               await this.createSmallImage(photo);

            const newPhoto: Photo = new Photo();
            newPhoto.roomId = roomId;
            newPhoto.imagePath = photo.filename;

           const savePhoto = await this.photoService.add(newPhoto);

           if(!savePhoto){
               return new ApiResponse('error', -4001);
           }
           return savePhoto;
        }

        async createThumb(photo){
            const originalFilePath = photo.path;
            const fileName = photo.filename;
            
    const destinationFilePath = StorageConfig.photoDestination + "thumb/" + fileName;
        await sharp(originalFilePath)
            .resize({
                fit: 'cover',
                width: StorageConfig.photoTumbSize.with,
                height: StorageConfig.photoTumbSize.height,
                background: {
                    r: 255, g:255, b:255, alpha: 0.0
                }
            })
            .toFile(destinationFilePath);


        }
        async createSmallImage(photo){
            const originalFilePath = photo.path;
            const fileName = photo.filename;
            
    const destinationFilePath = StorageConfig.photoDestination + "small/" + fileName;
        await sharp(originalFilePath)
            .resize({
                fit: 'cover',
                width: StorageConfig.photoSmallSize.with,
                height: StorageConfig.photoSmallSize.height,
                background: {
                    r: 255, g:255, b:255, alpha: 0.0
                }
            })
            .toFile(destinationFilePath);
        }

    }