import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {PassportStrategy} from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private prisma: PrismaService,
    ){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.SECRET_KEY,
        });
    }

    async validate(payload: {
        sub: number;
        email: string;
      }) {
        const user =
          await this.prisma.user.findUnique({
            where: {
              id: payload.sub,
            },
          });
        delete user.hash;
        return user;
      }
}