import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { FriendSchema } from './schemas/friend.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Friend', schema: FriendSchema }]),
  ],
  controllers: [FriendController],
  providers: [FriendService]
})
export class FriendModule {}