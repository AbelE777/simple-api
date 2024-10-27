import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async signIn(signInDto: SignInDto) {
    const { username, password } = signInDto;

    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const passwordIsValid = await user.validatePassword(password);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload = { sub: user.id_usuario, username: user.usuario };
    const accessToken = await this.jwtService.signAsync(payload);

    delete user.password;
    return { access_token: accessToken, user };
  }
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && (await user.validatePassword(password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
