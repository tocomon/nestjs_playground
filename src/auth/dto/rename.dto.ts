import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RenameDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
  
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;
}
