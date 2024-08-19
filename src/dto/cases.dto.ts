import { IsOptional, IsString } from 'class-validator';

export class CreateCaseDto {
  @IsString()
  name: string;

  @IsString()
  authorId: string;
}

export class UpdateCaseDto {
  @IsOptional()
  @IsString()
  name?: string;
}
