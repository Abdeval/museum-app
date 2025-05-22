import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ChronologicalCategories, ThematicCategories } from 'generated/prisma';

export class CreateExhibitDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  year: string;

  @IsNotEmpty()
  @IsEnum(ThematicCategories)
  thematic_category: ThematicCategories;

  @IsNotEmpty()
  @IsEnum(ChronologicalCategories)
  chronological_category: ChronologicalCategories;
}

export class CreateFavoriteDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  exhibitId: number;
}
