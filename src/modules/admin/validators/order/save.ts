import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { IOrder } from 'modules/database/interfaces/order';

export class SaveValidatorOrder implements IOrder {
  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ required: false, type: 'integer' })
  public id?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty({ required: false, type: 'integer' })
  public userId?: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  @ApiProperty({ required: true, type: 'string', maxLength: 150 })
  public description: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: true, type: 'integer' })
  public amount: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ required: true, type: 'integer' })
  public total: number;
}
