import { ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService,private jwt:JwtService,private config:ConfigService) {}

  async signup(dto: AuthDto) {
    // hash the password
    const hash = await bcrypt.hash(dto.password, 10);
    //  insert data to the database
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      // delete user hash
      delete user.hash;
      // return user
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    // find the user
    let user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    // if the user doesn't exist throw exception
    if (!user) throw new ForbiddenException('Credentials incorrect');

    // // compare password
    const isMatch = await bcrypt.compare(dto.password, user.hash);

    // // if password incorrent throw exception
    if (!isMatch) throw new ForbiddenException('Credentials incorrect');

    // // send back the user
    return this.signToken(user.id,user.email);
  }

  // generate jwt
   async signToken(userId:number,email:string):Promise<{access_token : string}>{
      const payload = {
        sub:userId,
        email
      }
      const secret = this.config.get("SECRET_KEY")

      const token = await this.jwt.signAsync(payload,{
        expiresIn:'13m',
        secret:secret
      })

      return {
        access_token:token,
      };
  }
}
