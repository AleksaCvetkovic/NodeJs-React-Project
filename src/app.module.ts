import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from 'config/database.configuration';
import { AppController } from './controller/api/app.controller';
import { administratorController } from './controller/api/administrator.controller';
import { Administrator } from './entities/administrator.entity';
import { Photo } from './entities/photo.entity';
import { Reservation } from './entities/reservation.entity';
import { Room } from './entities/room.entity';
import { RoomFeature } from './entities/roomFeature.entity';
import { RoomPrice } from './entities/roomPrice.entity';
import { User } from './entities/user.entity';
import { AdministratorService } from './services/administrator/administrator.service';
import { RoomService } from './services/room/room.service';
import { roomController } from './controller/api/room.controller';
import { AuthController } from './controller/api/auth.controller';
import { AuthMiddleware } from './middlewers/auth.middlweres';
import { PhotoService } from './services/photo/photos.service';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DatabaseConfiguration.hostname,
      port: 3306,
      username: DatabaseConfiguration.username,
      password: DatabaseConfiguration.password,
      database: DatabaseConfiguration.database,
      entities: [Administrator,RoomFeature,Photo,User,Reservation,Room,RoomPrice],
    }),
    TypeOrmModule.forFeature([Administrator,RoomFeature,Photo,User,Reservation,Room,RoomPrice]),
  ],
  controllers: [AppController,administratorController, roomController, AuthController],
  providers: [AdministratorService, RoomService , PhotoService],
  exports: [
    AdministratorService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(AuthMiddleware)
    .exclude('auth/*')
    .forRoutes('api/*');
  }
  
}
