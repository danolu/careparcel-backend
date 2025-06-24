import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidateCodeDto } from './dto/validate-code.dto';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class CodeService {
  constructor(
    private prisma: PrismaService,
    private orderService: OrderService,
  ) {}

  async validateCode(validateCodeDto: ValidateCodeDto) {
    const { purchaseCode, email, productId, locationId, quantity } =
      validateCodeDto;

    const parsedQuantity = parseInt(quantity as string);
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      throw new BadRequestException(
        'Quantity must be a valid number greater than 0.',
      );
    }

    const codeRecord = await this.prisma.purchaseCode.findFirst({
      where: { code: purchaseCode, expiresAt: { gt: new Date() } },
      include: { products: true },
    });

    if (!codeRecord) {
      throw new BadRequestException(
        'Your purchase code is invalid or has expired.',
      );
    }

    if (!codeRecord.products.some((product) => product.id === productId)) {
      throw new BadRequestException(
        'Your purchase code is not valid for this product.',
      );
    }

    if (parsedQuantity > codeRecord.maxOrderQuantity) {
      throw new BadRequestException(
        `Your purchase code can only be used to order a maximum of ${codeRecord.maxOrderQuantity} product(s).`,
      );
    }

    const { _sum } = await this.prisma.transaction.aggregate({
      where: { purchaseCode: { code: purchaseCode } },
      _sum: { quantity: true },
    });

    const totalOrderedQuantity = _sum.quantity ?? 0;

    if (totalOrderedQuantity + parsedQuantity > codeRecord.totalOrderLimit) {
      if (parsedQuantity === 1) {
        throw new BadRequestException(
          'Your purchase code has reached its total order limit.',
        );
      } else {
        throw new BadRequestException(
          'It is possible that your purchase code has reached its total order limit. You can reduce your order quantity and try again.',
        );
      }
    }

    await this.orderService.fulfillOrder({
      email,
      productId,
      locationId,
      quantity,
      purchaseCode,
    });

    return { message: 'Order fulfilled successfully.' };
  }
}
