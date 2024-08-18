import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateCaseDto, UpdateCaseDto } from 'src/dto/cases.dto';
import { CasesService } from './cases.service';

@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Post()
  async create(@Body() dto: CreateCaseDto) {
    return this.casesService.create(dto);
  }

  @Get()
  async findAll(@Query('authorId') authorId: string) {
    if (!authorId) {
      throw new Error('Author ID is required');
    }
    return this.casesService.findAll(authorId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.casesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCaseDto) {
    return this.casesService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.casesService.remove(id);
  }
}
