import { Body, Controller, Get, Patch, Post, Query, UseGuards, Param, Req, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { UpdateDto } from './dto/update.dto';
import { AuthGuard } from '@nestjs/passport';
import { LostDto } from './dto/lost.dto';
import { RenameDto } from './dto/rename.dto';
import { GetoneDto } from './dto/getone.dto';
import { User } from './schemas/user.schema';
import { RequestFriendDto } from './dto/requestfriend.dto';
import { AcceptFriendDto } from './dto/acceptfriend.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Get('/login')
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }

  @Get('/logout')
  logout(@Request() req): any {
    req.cookie.destroy();
    return { msg: 'The user has loggedout' }
  }

  @Patch('/update')
  @UseGuards(AuthGuard())
  update(@Body() updateDto: UpdateDto) {
    return this.authService.update(updateDto);
  }

  @Get('/lost')
  lost(@Body() lostDto: LostDto) {
    return this.authService.lost(lostDto);
  }

  @Patch('/rename')
  @UseGuards(AuthGuard())
  rename(@Body() renameDto: RenameDto) {
    return this.authService.rename(renameDto);
  }

  @Get('/getall')
  getall(){
    return  this.authService.getAll();
  }
  
  @Get("/getone")
  getOne(@Body() getoneDto: GetoneDto) {
    return this.authService.getOne(getoneDto);
  }

  @Post("/requestfriend")
  @UseGuards(AuthGuard())
  requestFriend(@Body() requestfriendDto: RequestFriendDto, @Req() req) {
    return this.authService.requestFriend(requestfriendDto, req.user);
  }

  @Get("/acceptfriend")
  @UseGuards(AuthGuard())
  acceptFriend(@Body() acceptfriendDto: AcceptFriendDto, @Req() req) {
    return this.authService.acceptFriend(acceptfriendDto, req.user);
  }
}
