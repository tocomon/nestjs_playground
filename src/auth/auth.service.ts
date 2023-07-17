import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateDto } from './dto/update.dto';
import { LostDto } from './dto/lost.dto';
import { RenameDto } from './dto/rename.dto';
import { GetoneDto } from './dto/getone.dto';
import { Query } from 'express-serve-static-core';
import { RequestFriendDto } from './dto/requestfriend.dto';
import { AcceptFriendDto } from './dto/acceptfriend.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { name, email, password } = signUpDto;

    // const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,12}$/;
    // if (!passwordRegex.test(password)) {
    //   throw new Error('Password must be 8 to 12 characters long and include at least one letter, one number, and one special character.');
    // }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }

  async update(updateDto: UpdateDto) {
    const { email, password } = updateDto;
    
    // const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,12}$/;
    // if (!passwordRegex.test(password)) {
    //   throw new Error('Password must be 8 to 12 characters long and include at least one letter, one number, and one special character.');
    // }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.userModel.updateOne({email}, {password: hashedPassword})

    return {msg:"Password Changed"};
  }

  async lost(lostDto: LostDto) {
    const { email } = lostDto;
    
    const newPassword = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userModel.updateOne({email}, {password: hashedPassword})

    return {password: newPassword};
  }

  async rename(renameDto: RenameDto) {
    const { name, email} = renameDto;

    await this.userModel.updateOne({email}, {name: name})

    return {msg:`Name Changed to ${name}`};
  }

  async getAll() {
    const res = await this.userModel.find()
    return res;
  }

  async getOne(getoneDto: GetoneDto) {
    const { email } = getoneDto;
    const user = await this.userModel.findOne({ email });
    if(!user){
        throw new NotFoundException(`User with name ${email} not found.`)
    }
    return user;
  }

  async requestFriend(requestfriendDto: RequestFriendDto, user: User) {
    const { email } = requestfriendDto;

    const res = await this.userModel.updateOne({ email }, { $push: { friendrequest: user.email }})
    return res;
  }

  async acceptFriend(acceptfriendDto: AcceptFriendDto, user: User) {
    const { email } = acceptfriendDto;
    const mymail = user.email;
    await this.userModel.updateOne({ mymail }, { $pull: { friendrequest: email }})
    
    await this.userModel.updateOne({ mymail }, { $push: { friend: email }})
    await this.userModel.updateOne({ email }, { $push: { friend: mymail }})
    return {msg:`${email} has added to friend`};
  }
}
