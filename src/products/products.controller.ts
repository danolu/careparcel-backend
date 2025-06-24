import { Controller } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Get } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  async getActive() {
    return this.productService.findAllActive();
  }
}
