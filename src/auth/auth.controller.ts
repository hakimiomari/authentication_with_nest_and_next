import { Controller, Post, Body,} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  singup(@Body() dto:AuthDto) {
    return this.authService.signup(dto);
  }
 
  @Post('signin')
  singin(@Body() dto:AuthDto) {
    return this.authService.signin(dto);
  }

}
