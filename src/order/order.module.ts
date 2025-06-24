import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderController } from './order.controller';

@Module({
  providers: [OrderService, ConfigService, PrismaService],
  exports: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
