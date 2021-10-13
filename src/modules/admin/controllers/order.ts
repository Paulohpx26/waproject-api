import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthRequired, CurrentUser } from 'modules/common/guards/token';
import { ICurrentUser } from 'modules/common/interfaces/currentUser';
import { Order } from 'modules/database/models/order';

import { OrderService } from '../services/order';
import { ListValidatorOrder } from '../validators/order/list';
import { SaveValidatorOrder } from '../validators/order/save';

@ApiTags('Order')
@Controller('/order')
@AuthRequired()
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description:
      'If the session user is an `admin` the return will be all orders, if not only those created by the self.',
    type: [Order]
  })
  public async list(@Query() model: ListValidatorOrder, @CurrentUser() currentUser: ICurrentUser) {
    return this.orderService.list(model, currentUser);
  }

  @Get(':orderId')
  @ApiOperation({
    description: 'If the session user is a `admin` can show any order, if not just the ones created by the self.'
  })
  @ApiResponse({ status: 200, type: Order })
  public async details(@Param('orderId', ParseIntPipe) orderId: number, @CurrentUser() currentUser: ICurrentUser) {
    return this.orderService.findById(orderId, currentUser);
  }

  @Delete(':orderId')
  @ApiOperation({
    description: 'If the session user is a `admin` can delete any order, if not just the ones created by the self.'
  })
  public async delete(@Param('orderId', ParseIntPipe) orderId: number, @CurrentUser() currentUser: ICurrentUser) {
    return this.orderService.remove(orderId, currentUser);
  }

  @Post()
  @ApiOperation({
    description: 'If the session user is a `admin` can update any order, if not just the ones created by the self.'
  })
  @ApiResponse({ status: 200, type: Order })
  public async save(@Body() model: SaveValidatorOrder, @CurrentUser() currentUser: ICurrentUser) {
    return this.orderService.save(model, currentUser);
  }
}
