import { Controller, UseGuards } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { RoomFeature } from "src/entities/roomFeature.entity";
import { AllowToRoles } from "src/misk/allow.to.roles.descriptor";
import { roleChekerGard } from "src/misk/role.cheker.gard";
import { RoomFeatureService } from "src/services/room-feature/room.feature.service";

@Controller('api/roomFeatures')
@Crud({
    model: {
        type: RoomFeature
    },
    params: {
        id: {
            field: 'roomFeatureId',
            type: 'number',
            primary: true
        }
    },
    query: {
        join: {
            room: {
                eager: true
            },
        }
    },
    routes: {
        only: [
            "createOneBase",
            "createManyBase",
            "getManyBase",
            "getOneBase",
            "updateOneBase",
        ],
        createOneBase: {
            decorators: [
                UseGuards(roleChekerGard),
                AllowToRoles('administrator'),
            ],
        },
        createManyBase: {
            decorators: [
                UseGuards(roleChekerGard),
                AllowToRoles('administrator'),
            ],
        },
        getManyBase: {
            decorators: [
                UseGuards(roleChekerGard),
                AllowToRoles('administrator', 'user'),
            ],
        },
        getOneBase: {
            decorators: [
                UseGuards(roleChekerGard),
                AllowToRoles('administrator', 'user'),
            ],
        },
        updateOneBase: {
            decorators: [
                UseGuards(roleChekerGard),
                AllowToRoles('administrator'),
            ],
        },
    },
})
export class RoomFeatureController {
    constructor(public service: RoomFeatureService){ }
}