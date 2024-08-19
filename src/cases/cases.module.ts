import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CasesController } from './cases.controller';
import { CasesService } from './cases.service';

@Module({
  providers: [CasesService, PrismaService],
  controllers: [CasesController],
})
export class CasesModule {}
