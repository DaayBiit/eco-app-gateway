import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/configs';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    @Inject( NATS_SERVICE ) private readonly client: ClientProxy, 
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    try {
      console.log( 'Header token: ',  token)

      const auth = await firstValueFrom(
        this.client.send('auth.verify.user', token)
      );
      console.log('Auth: ', auth)
      request['user'] = auth.user;
      request['token'] = auth.token;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}