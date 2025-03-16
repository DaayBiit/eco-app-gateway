import { Body, Controller, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/configs';
import { RegisterUserDto } from './dto/register-user.dto';
import { catchError } from 'rxjs';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Token } from './decorators/token.decorator';
import { User } from './decorators/user.decorator';
import { CurrentUser } from './interfaces/current-user.interface';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {}
  
  
  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.client.send('auth.register.user', registerUserDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.client.send('auth.login.user', loginUserDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }


  @UseGuards( AuthGuard )
  @Get('verify')
  verifyToken( @User() user: CurrentUser, @Token() token: string  ) {

    // const user = req['user'];
    // const token = req['token'];

    return this.client.send('auth.verify.user', {user, token});
  }

  @Get('check')
  checkAuth(@Param('token') token: string) {
    return this.client.send('auth.check.user', {token})
      .pipe( catchError( err => { throw new RpcException(err)}));
  }
}
