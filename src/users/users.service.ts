import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { TokenPayload } from 'src/auth/interface/token-payload.interface';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateOwnerDto } from './dto/create-owner.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllUsers(businessId: number) {
    return await this.prismaService.user.findMany({
      where: {
        businessId,
      },
    });
  }

  async insertAdmin() {
    try {
      const hashedPassword = await bcrypt.hash('business14', 10);
      const admin = await this.prismaService.user.create({
        data: {
          name: 'Jesus',
          email: 'jesusaltamirano14@hotmail.com',
          password: hashedPassword,
          role: 'ADMIN',
          businessId: null,
        },
      });
      return admin;
    } catch (error) {
      if (error instanceof Error)
        throw new HttpException(
          { error: error.message },
          HttpStatus.BAD_REQUEST,
        );
    }
  }
  async createOwner(createOwnerDto: CreateOwnerDto) {
    try {
      const hashedPassword = await bcrypt.hash(createOwnerDto.password, 10);
      const userCreated = await this.prismaService.user.create({
        data: {
          name: createOwnerDto.name,
          role: 'OWNER',
          email: createOwnerDto.email,
          password: hashedPassword,
          business: {
            connect: {
              id: createOwnerDto.businessId,
            },
          },
        },
      });

      const { password, ...rest } = userCreated;
      return rest;
    } catch (error) {
      if (error instanceof Error)
        throw new HttpException(
          { error: error.message },
          HttpStatus.BAD_REQUEST,
        );
    }
  }

  async createUser(createUserDto: CreateUserDto, payload: TokenPayload) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const userCreated = await this.prismaService.user.create({
        data: {
          name: createUserDto.name,
          role: createUserDto.role,
          email: createUserDto.email,
          password: hashedPassword,
          business: {
            connect: {
              id: payload.businessId,
            },
          },
        },
      });

      const { password, ...rest } = userCreated;
      return rest;
    } catch (error) {
      if (error instanceof Error)
        throw new HttpException(
          { error: error.message },
          HttpStatus.BAD_REQUEST,
        );
    }
  }

  async findUserWithEmail(email: string) {
    return await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async deleteUserWithId(id: number) {
    try {
      await this.prismaService.user.delete({
        where: {
          id,
        },
      });
      return `user ${id} deleted successfully`;
    } catch (error) {
      if (error instanceof Error)
        throw new HttpException(
          { error: error.message },
          HttpStatus.BAD_REQUEST,
        );
    }
  }
}
