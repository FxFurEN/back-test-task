import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateCaseDto } from 'src/dto/cases.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CasesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCaseDto) {
    const { authorId, name } = dto;
    return this.prisma.cases.create({
      data: {
        name,
        author: {
          connect: { id: authorId },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.cases.findMany();
  }

  async findOne(id: string) {
    return this.prisma.cases.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: Prisma.CasesUpdateInput) {
    return this.prisma.cases.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.cases.delete({
      where: { id },
    });
  }
}
