import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOwnerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNumber()
  @IsNotEmpty()
  businessId: number;
}
