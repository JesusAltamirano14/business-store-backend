import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsEnum(['ADMIN', 'MANAGER', 'CASHIER'], {
    message: 'Valid Role Required',
  })
  role: 'ADMIN' | 'MANAGER' | 'CASHIER';

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
