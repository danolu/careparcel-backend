import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Resend } from 'resend';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { OrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  private resend: Resend;
  private resendEmail: string;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    const resendApiKey = this.config.get<string>('RESEND_API_KEY');
    this.resendEmail = this.config.get<string>('RESEND_EMAIL') ?? '';

    if (!resendApiKey || !this.resendEmail) {
      console.error('Resend API key or email not found in environment variables');
      throw new InternalServerErrorException('Server email configuration missing.');
    }

    this.resend = new Resend(resendApiKey);
  }

  async checkCodesAvailability() {
    return this.prisma.accessCode.count({
      where: { assignedAt: null, isUsed: false },
    });
  }

  generateTransactionRef(): string {
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `CP-${timestamp}-${random}`;
  }

  async fulfillOrder(orderDto: OrderDto) {
    const { email, productId, locationId, quantity, purchaseCode } = orderDto;

    const accessCode = await this.prisma.accessCode.findFirst({
      where: { assignedAt: null, isUsed: false },
    });

    if (!accessCode) {
      throw new BadRequestException('Sorry, all access codes have been claimed. Try again later.');
    }

    const ref = this.generateTransactionRef();

    const transaction = await this.prisma.$transaction(async (tx) => {
      const transactionData: any = {
        productId,
        locationId,
        quantity,
        ref,
        accessCode: {
          connect: { id: accessCode.id },
        },
      };

      if (purchaseCode) {
        transactionData.purchaseCode = { connect: { code: purchaseCode } };
      }

      const txRecord = await tx.transaction.create({ data: transactionData });

      await tx.accessCode.update({
        where: { id: accessCode.id },
        data: {
          assignedAt: new Date(),
          transaction: { connect: { id: txRecord.id } },
        },
      });

      return txRecord;
    });

    const location = await this.prisma.location.findUnique({
      where: { id: locationId },
    });

    if (!location) {
      throw new InternalServerErrorException('Selected location not found.');
    }

    try {
      await this.resend.emails.send({
        from: `CareParcel <${this.resendEmail}>`,
        to: email,
        subject: 'Your CareParcel Order Details',
        html: `
          <p>Dear Valued Customer,</p>
          <p>Your CareParcel order details:</p>
          <ul>
            <li><strong>Dropbox Location:</strong> ${location.name}</li>
            <li><strong>Access Code:</strong> ${accessCode.code}</li>
            <li><strong>Transaction Ref:</strong> ${ref}</li>
          </ul>
          <p>⚠️ This access code is valid for 48 hours.</p>
          <p>If you encounter any issue with your order, kindly reach out to our support via the chatbox on our website.</p>
          <p>Thank you for using CareParcel.</p>
        `,
      });
    } catch (err) {
      console.error('Failed to send email:', err);
    }

    return {
      message: 'Order successful',
    };
  }
}