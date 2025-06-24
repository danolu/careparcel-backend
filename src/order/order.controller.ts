import { Controller, Post, Body, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  async fulfillOrder(@Body() orderDto: OrderDto) {
    return this.orderService.fulfillOrder(orderDto);
  }

  @Get('check-codes-availability')
  async checkCodesAvailability() {
    return this.orderService.checkCodesAvailability();
  }
}
