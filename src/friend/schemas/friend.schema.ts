import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../auth/schemas/user.schema';


@Schema({
  timestamps: true,
})
export class Friend {
  @Prop()
  userId: string;

  @Prop()
  friendId: string;

  @Prop()
  accept: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const FriendSchema = SchemaFactory.createForClass(Friend);

