import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ unique: [true, 'Duplicate email entered'] })
  email: string;

  @Prop()
  password: string;

  @Prop()
  online: boolean; // 0: logout, 1: login

  @Prop()
  friend: string[];

  @Prop()
  friendrequest: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
