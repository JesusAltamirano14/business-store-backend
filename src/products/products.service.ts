import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { TokenPayload } from 'src/auth/interface/token-payload.interface';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllProducts(tokenPayload: TokenPayload) {
    try {
      const { businessId } = tokenPayload;

      return await this.prismaService.product.findMany({
        where: {
          businessId,
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

  async createProduct(
    createProductDto: CreateProductDto,
    tokenPayload: TokenPayload,
  ) {
    try {
      const { name, description, price, stockQuantity, imageUrl } =
        createProductDto;
      const { businessId } = tokenPayload;

      return await this.prismaService.product.create({
        data: {
          name,
          description,
          price,
          stockQuantity,
          imageUrl,
          business: {
            connect: {
              id: businessId,
            },
          },
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

  async deleteProduct(productId: number) {
    try {
      await this.prismaService.product.delete({
        where: {
          id: productId,
        },
      });
      return `the product with the id: ${productId} was deleted successfully`;
    } catch (error) {
      if (error instanceof Error)
        throw new HttpException(
          { error: error.message },
          HttpStatus.BAD_REQUEST,
        );
    }
  }

  async updateProduct(updateProductDto: UpdateProductDto, productId: number) {
    try {
      const productUpdated = await this.prismaService.product.update({
        where: {
          id: productId,
        },
        data: updateProductDto,
      });

      return productUpdated;
    } catch (error) {
      if (error instanceof Error)
        throw new HttpException(
          { error: error.message },
          HttpStatus.BAD_REQUEST,
        );
    }
  }
}
