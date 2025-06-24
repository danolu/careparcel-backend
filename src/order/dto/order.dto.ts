import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class OrderDto {
  @IsOptional()
  @IsString()
  purchaseCode?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsString()
  locationId: string;

  @IsNotEmpty()
  @IsString()
  quantity: string;
}
