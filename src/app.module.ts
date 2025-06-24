import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { LocationsModule } from './locations/locations.module';
import { CodeModule } from './code/code.module';
import { OrderService } from './order/order.service';
import { OrderModule } from './order/order.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    ProductsModule,
    LocationsModule,
    CodeModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService, OrderService, PrismaService],
})
export class AppModule {}
