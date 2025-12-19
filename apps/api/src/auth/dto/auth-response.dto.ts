import { ApiProperty } from '@nestjs/swagger';
import { USER_ROLE_VALUES } from '@prontuario/shared';

export class AuthTokensDto {
  @ApiProperty({ description: 'Token JWT de acesso' })
  accessToken!: string;

  @ApiProperty({ description: 'Tempo de expiração (ex.: 1h)', example: '1h' })
  expiresIn!: string;
}

export class AuthUserDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ enum: USER_ROLE_VALUES })
  role!: typeof USER_ROLE_VALUES[number];

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: string | Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: string | Date;
}

export class AuthResponseDto {
  @ApiProperty({ type: AuthUserDto })
  user!: AuthUserDto;

  @ApiProperty({ type: AuthTokensDto })
  tokens!: AuthTokensDto;
}
