import { Module } from '@nestjs/common';
import { CodeController } from './code.controller';
import { CodeService } from './code.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderService } from 'src/order/order.service';

@Module({
  controllers: [CodeController],
  providers: [CodeService, PrismaService, OrderService],
})
export class CodeModule {}
