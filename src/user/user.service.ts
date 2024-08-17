import { Injectable } from '@nestjs/common';
import { EditUserDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma:PrismaService){}
  create() {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(userId:number,dto:EditUserDto) {
    const user = await this.prisma.user.update({
      where:{
        id: userId
      },
      data:{...dto}
    })

    delete user.hash;
    return user;

  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
