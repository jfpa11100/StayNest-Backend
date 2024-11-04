import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/users/interfaces/jwt-payload.interface';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private jwtService:JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    if(!token){
      throw new UnauthorizedException("No se ha enviado el token");
    }
    try{
      const payload = this.jwtService.verify<JwtPayload>(token);
      request.body['userId'] = payload.id;
    }catch(error){
      throw new UnauthorizedException("Token inválido");
    }
    return true;
  }


  private extractToken(request:Request):string | undefined{
    const [type, token] = request.headers['authorization']?.split(' ')??[];
    return type === 'Bearer' ? token : undefined;
  }
}