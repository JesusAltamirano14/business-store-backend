import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get()
  getOneBusiness(@Req() req) {
    return this.businessService.getOneBusiness(req.user);
  }

  @Roles(['ADMIN'])
  @Get()
  getAllBusiness() {
    return this.businessService.getAllBusiness();
  }

  @Roles(['ADMIN'])
  @Post('create')
  async createBusiness(
    @Body(ValidationPipe) createBusinessDto: CreateBusinessDto,
  ) {
    return await this.businessService.createBusiness(createBusinessDto);
  }

  @Roles(['ADMIN'])
  @Delete('delete/:id')
  async deleteBusiness(@Param('id', ParseIntPipe) id: number) {
    console.log('You are here in the handler');
    return await this.businessService.deleteBusiness(id);
  }
}
