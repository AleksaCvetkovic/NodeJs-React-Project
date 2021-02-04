import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from 'config/database.configuration';
import { AppController } from './app.controller';
import { Administrator } from './entities/administrator.entity';
import { Feature } from './entities/feature.entity';
import { Photo } from './entities/photo.entity';
import { Reservation } from './entities/reservation.entity';
import { Room } from './entities/room.entity';
import { RoomFeature } from './entities/roomFeature.entity';
import { RoomPrice } from './entities/roomPrice.entity';
import { User } from './entities/user.entity';
import { AdministratorService } from './services/administrator/administrator.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DatabaseConfiguration.hostname,
      port: 3306,
      username: DatabaseConfiguration.username,
      password: DatabaseConfiguration.password,
      database: DatabaseConfiguration.database,
      entities: [Administrator,Feature,RoomFeature,Photo,User,Reservation,Room,RoomPrice],
    }),
    TypeOrmModule.forFeature([Administrator]),
  ],
  controllers: [AppController],
  providers: [AdministratorService],
})
export class AppModule {}
