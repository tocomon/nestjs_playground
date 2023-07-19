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
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { email, password } = signUpDto;
    const isUserExist = await this.userModel.exists({email: email});
    if (isUserExist) {
      throw new UnauthorizedException('duplicate email');
    }

    // const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,12}$/;
    // if (!passwordRegex.test(password)) {
    //   throw new Error('Password must be 8 to 12 characters long and include at least one letter, one number, and one special character.');
    // }

    const hashedPassword = await bcrypt.hash(password, 10);
    const name = "";
    const online = 0;
    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      online
    });

    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email: email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }
    await this.userModel.updateOne({email: email}, {login: 1})
    const token = this.jwtService.sign({ id: user._id });
    
    return { token };
  }

  async logout(user: User){
    const mymail = user.email;
    await this.userModel.updateOne({ email: mymail }, { online: 0 })
    return {msg:`${mymail} has logout`};
  }

  async update(updateDto: UpdateDto) {
    const { email, password } = updateDto;
    
    // const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,12}$/;
    // if (!passwordRegex.test(password)) {
    //   throw new Error('Password must be 8 to 12 characters long and include at least one letter, one number, and one special character.');
    // }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.userModel.updateOne({email: email}, {password: hashedPassword})

    return {msg:"Password Changed"};
  }

  // async lost(lostDto: LostDto) {
  //   const { email } = lostDto;
    
  //   const newPassword = Math.floor(100000 + Math.random() * 900000).toString();
  //   const hashedPassword = await bcrypt.hash(newPassword, 10);
  //   await this.userModel.updateOne({email: email}, {password: hashedPassword})

  //   return {password: newPassword};
  // }

  async rename(renameDto: RenameDto) {
    const { name, email} = renameDto;

    await this.userModel.updateOne({email: email}, {name: name})

    return {msg:`Name Changed to ${name}`};
  }

  async getAll() {
    const res = await this.userModel.find()
    return res;
  }

  async getOne(getoneDto: GetoneDto) {
    const { email } = getoneDto;
    const user = await this.userModel.findOne({ email: email });
    if(!user){
        throw new NotFoundException(`User with name ${email} not found.`)
    }
    return user;
  }

  async sendEmail(lostDto: LostDto) {
    const { email } = lostDto;

    const newPassword = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userModel.updateOne({email: email}, {password: hashedPassword})

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.LOST_ID,
        pass: process.env.LOST_PWD
      }
    });
  
    const mailOptions = {
      from: process.env.LOST_ID,
      to: email,
      subject: 'New password',
      text: `Your password is ${newPassword}.`
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
      return {msg:"new password mail sent"};
    } catch (error) {
      console.error('Error sending email:', error);
      return {msg:"Error sending email"};
    }
  }
}
