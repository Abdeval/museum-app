import {
  IsInt,
  IsNotEmpty,
  IsArray,
  IsString,
  ArrayNotEmpty,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { SenderType } from 'generated/prisma';

export class CreateChatDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsOptional()
  title?: string;

  // @IsArray()
  // @ArrayNotEmpty()
  // messages: CreateMessageDto[];
}

export class CreateMessageDto {
  @IsInt()
  @IsNotEmpty()
  chatId: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(SenderType)
  @IsNotEmpty()
  type: SenderType;

  @IsOptional()
  @IsBoolean()
  isFirstMessage?: boolean;

  @IsOptional()
  @IsArray()
  exhibits?: number[];
  // @IsOptional()
}
