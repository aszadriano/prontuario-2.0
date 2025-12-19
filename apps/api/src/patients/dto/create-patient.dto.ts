import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddressDto {
  @ApiProperty({ description: 'Logradouro', example: 'Av. Paulista' })
  @IsString()
  @IsNotEmpty()
  street!: string;

  @ApiProperty({ description: 'Número', example: '1000' })
  @IsString()
  @IsNotEmpty()
  number!: string;

  @ApiPropertyOptional({ description: 'Complemento', example: 'Apto 12' })
  @IsOptional()
  @IsString()
  complement?: string;

  @ApiPropertyOptional({ description: 'Bairro', example: 'Bela Vista' })
  @IsOptional()
  @IsString()
  neighborhood?: string;

  @ApiProperty({ description: 'Cidade', example: 'São Paulo' })
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiProperty({ description: 'Estado (UF)', example: 'SP' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2)
  state!: string;

  @ApiProperty({ description: 'CEP', example: '01310-100' })
  @IsString()
  @IsNotEmpty()
  zipCode!: string;
}

export class EmergencyContactDto {
  @ApiPropertyOptional({ description: 'Nome do contato de emergência' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Telefone do contato de emergência' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Relação com o paciente' })
  @IsOptional()
  @IsString()
  relationship?: string;
}

export class CreatePatientDto {
  @ApiProperty({
    description: 'Nome completo do paciente',
    maxLength: 180,
    example: 'João da Silva'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  fullName!: string;

  @ApiProperty({ description: 'Data de nascimento (ISO)', example: '1985-04-10' })
  @IsDateString()
  birthDate!: string;

  @ApiProperty({ description: 'Documento de identificação', maxLength: 40, example: '12345678900' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  documentId!: string;

  @ApiProperty({ description: 'RG do paciente', maxLength: 40, example: '45.123.456-7' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  rg!: string;

  @ApiProperty({ description: 'Sexo ou gênero', example: 'Feminino' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  gender!: string;

  @ApiProperty({ description: 'Estado civil', example: 'Casado(a)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  maritalStatus!: string;

  @ApiPropertyOptional({ description: 'Telefone de contato', maxLength: 40, example: '+55 11 99999-0000' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string;

  @ApiPropertyOptional({ description: 'Telefone do WhatsApp', maxLength: 40, example: '+55 11 98888-0000' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  whatsapp?: string;

  @ApiPropertyOptional({ description: 'E-mail do paciente', maxLength: 160, example: 'paciente@example.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(160)
  email?: string;

  @ApiProperty({ description: 'Profissão do paciente', maxLength: 120, example: 'Professor(a)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  profession!: string;

  @ApiProperty({
    description: 'Endereço completo do paciente',
    type: AddressDto
  })
  @ValidateNested()
  @Type(() => AddressDto)
  addressJson!: AddressDto;

  @ApiPropertyOptional({
    description: 'Contato de emergência (opcional)',
    type: EmergencyContactDto
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => EmergencyContactDto)
  emergencyContact?: EmergencyContactDto;
}
