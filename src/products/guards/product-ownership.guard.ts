import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokenPayload } from 'src/auth/interface/token-payload.interface';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ProductOwnerShipGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as TokenPayload;
    const params = request.params;
    const productId = Number(params.id);

    if (!productId) {
      throw new HttpException('Product ID is required', HttpStatus.BAD_REQUEST);
    }
    const productFounded = await this.prismaService.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        businessId: true,
      },
    });

    if (!productFounded)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    if (productFounded.businessId !== user.businessId) {
      throw new HttpException(
        'Unauthorized to access this product',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return true;
  }
}
