import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async findAllActive() {
    return this.prisma.location.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
      },
    });
  }
}
