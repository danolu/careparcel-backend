import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ValidateCodeDto {
  @IsNotEmpty()
  @IsString()
  purchaseCode: string;

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
