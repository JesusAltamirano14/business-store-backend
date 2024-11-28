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
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles/roles.decorator';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { RolesGuard } from 'src/auth/roles/roles.guard';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(['ADMIN', 'OWNER', 'MANAGER'])
  getAllUsers(@Req() req) {
    return this.usersService.getAllUsers(req.user.businessId);
  }

  @Roles(['ADMIN'])
  @Post('create-owner')
  createOwner(@Body(ValidationPipe) createOwnerDto: CreateOwnerDto) {
    return this.usersService.createOwner(createOwnerDto);
  }

  @Roles(['OWNER'])
  @Post('create')
  createUser(@Body(ValidationPipe) createUserDto: CreateUserDto, @Req() req) {
    return this.usersService.createUser(createUserDto, req.user);
  }

  @Roles(['ADMIN', 'OWNER'])
  @Delete('delete/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUserWithId(id);
  }
}
