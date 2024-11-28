import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { TokenPayload } from 'src/auth/interface/token-payload.interface';

@Injectable()
export class BusinessService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllBusiness() {
    return await this.prismaService.business.findMany();
  }

  async getOneBusiness(payload: TokenPayload) {
    try {
      const business = await this.prismaService.business.findUnique({
        where: {
          id: payload.businessId,
        },
      });
      return business;
    } catch (error) {
      if (error instanceof Error)
        throw new HttpException(
          { error: error.message },
          HttpStatus.BAD_REQUEST,
        );
    }
  }

  async createBusiness(createBusinessDto: CreateBusinessDto) {
    try {
      return await this.prismaService.business.create({
        data: {
          name: createBusinessDto.name,
        },
      });
    } catch (error) {
      if (error instanceof Error)
        throw new HttpException(
          { error: error.message },
          HttpStatus.BAD_REQUEST,
        );
    }
  }

  async deleteBusiness(businessId: number) {
    try {
      await this.prismaService.business.delete({
        where: {
          id: businessId,
        },
      });

      return `Business with id: ${businessId} was deleted successfully`;
    } catch (error) {
      if (error instanceof Error)
        throw new HttpException(
          { error: error.message },
          HttpStatus.BAD_REQUEST,
        );
    }
  }
}
