import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductOwnerShipGuard } from './guards/product-ownership.guard';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAllProducts(@Req() req) {
    return this.productsService.getAllProducts(req.user);
  }

  @Roles(['ADMIN', 'MANAGER', 'CASHIER'])
  @Post('create')
  createProduct(
    @Body(ValidationPipe) createProductDto: CreateProductDto,
    @Req() req,
  ) {
    return this.productsService.createProduct(createProductDto, req.user);
  }

  @UseGuards(ProductOwnerShipGuard)
  @Roles(['ADMIN', 'MANAGER'])
  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteProduct(id);
  }

  @UseGuards(ProductOwnerShipGuard)
  @Patch('update/:id')
  updateProduct(
    @Body(ValidationPipe) updateProductDto: UpdateProductDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.productsService.updateProduct(updateProductDto, id);
  }
}
