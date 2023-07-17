
import {
Body,
Controller,
Delete,
Get,
Param,
Post,
Put,
Query,
Req,
UseGuards,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';


@Controller('friend')
export class FriendController {
    constructor(private friendService: FriendService) {}

    @Get('/getall')
    getall(){
        return  this.friendService.getAll();
    }

}
