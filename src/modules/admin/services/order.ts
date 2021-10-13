import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ICurrentUser } from 'modules/common/interfaces/currentUser';
import { IOrder } from 'modules/database/interfaces/order';
import { IPaginationParams } from 'modules/common/interfaces/pagination';
import { Order } from 'modules/database/models/order';

import { Page } from 'objection';

import { OrderRepository } from '../repositories/order';

@Injectable()
export class OrderService {
  constructor(private orderRepository: OrderRepository) {}

  public async list(params: IPaginationParams, currentUser: ICurrentUser): Promise<Page<Order>> {
    if (currentUser.roles.includes('admin') || currentUser.roles.includes('sysAdmin')) {
      return this.orderRepository.list(params);
    } else {
      return this.orderRepository.list(params, currentUser.id);
    }
  }

  public async findById(orderId: number, currentUser: ICurrentUser): Promise<Order> {
    const order = await this.returnIfOrderBelongsUserOrRoleAdmin(orderId, currentUser);

    return order;
  }

  public async save(model: IOrder, currentUser: ICurrentUser): Promise<Order> {
    if (model.id) return this.update(model, currentUser);
    return this.create(model, currentUser);
  }

  public async remove(orderId: number, currentUser: ICurrentUser): Promise<void> {
    await this.returnIfOrderBelongsUserOrRoleAdmin(orderId, currentUser);

    return this.orderRepository.remove(orderId);
  }

  private async create(model: IOrder, currentUser: ICurrentUser): Promise<Order> {
    const order = await this.orderRepository.insert({ ...model, userId: currentUser.id });

    return order;
  }

  private async update(model: IOrder, currentUser: ICurrentUser): Promise<Order> {
    const order = await this.returnIfOrderBelongsUserOrRoleAdmin(model.id, currentUser);

    return this.orderRepository.update({ ...order, ...model, userId: order.userId });
  }

  private async returnIfOrderBelongsUserOrRoleAdmin(orderId: number, currentUser: ICurrentUser): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundException('not-found');
    }

    if (
      order.userId !== currentUser.id &&
      !(currentUser.roles.includes('admin') || currentUser.roles.includes('sysAdmin'))
    )
      throw new ForbiddenException('forbidden');

    return order;
  }
}
