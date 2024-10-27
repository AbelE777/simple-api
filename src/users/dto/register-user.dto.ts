import { IsString, IsEmail, IsDateString, IsInt } from 'class-validator';
import { Unique } from 'typeorm';

@Unique(['username', 'email'])
export class RegisterUserDto {
  @IsString()
  nombres: string;

  @IsString()
  apellidos: string;

  @IsString()
  cedula: string;

  @IsString()
  telefono: string;

  @IsEmail()
  email: string;

  @IsString()
  direccion: string;

  @IsString()
  genero: string;

  @IsDateString()
  fecha_nacimiento: Date;

  // @IsInt()
  // tipoUsuario: 1 | 2 | 3;

  // campos comunes para usuario
  @IsInt()
  rol: number;

  @IsString()
  username: string;

  @IsString()
  password: string;

  // campos para cliente
  @IsString()
  profesion?: string;

  @IsString()
  zona?: string;

  @IsInt()
  precio?: number;
}
