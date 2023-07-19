import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { UserSchema } from 'src/auth/schemas/user.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [FriendController],
  providers: [FriendService]
})
export class FriendModule {}