import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@demo.com', description: 'E-mail corporativo do usuário' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Senha#Forte123', minLength: 8, description: 'Senha do usuário' })
  @IsString()
  @MinLength(8)
  password!: string;
}
