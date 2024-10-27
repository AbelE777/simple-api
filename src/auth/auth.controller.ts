import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from '../users/dto/register-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('create-user')
  @UseGuards(JwtAuthGuard)
  async signUp(
    @Body(
      new ValidationPipe({
        skipMissingProperties: true, // Ignora propiedades faltantes
        skipNullProperties: true, // Ignora propiedades con valor null
      }),
    )
    registerUserDto: RegisterUserDto,
  ) {
    return this.usersService.create(registerUserDto);
  }

  @Get('validate-token')
  @UseGuards(JwtAuthGuard)
  async validateToken(@Request() req) {
    // Si llega a este punto, el token es válido
    return { message: 'Token válido' };
  }
}
