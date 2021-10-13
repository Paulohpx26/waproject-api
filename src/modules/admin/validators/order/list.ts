import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationValidator } from 'modules/common/validators/pagination';

export class ListValidatorOrder extends PaginationValidator {
  @IsString()
  @IsOptional()
  @IsIn(['description', 'amount', 'total', 'createdDate', 'updatedDate'])
  @ApiProperty({ required: false, enum: ['description', 'amount', 'total', 'createdDate', 'updatedDate'] })
  public orderBy: string;
}
