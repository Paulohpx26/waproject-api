import { Injectable } from '@nestjs/common';
import { IPaginationParams } from 'modules/common/interfaces/pagination';
import { IOrder } from 'modules/database/interfaces/order';
import { Order } from 'modules/database/models/order';
import { Page, Transaction } from 'objection';

@Injectable()
export class OrderRepository {
  public async list(params: IPaginationParams, filterByUser?: number, transaction?: Transaction): Promise<Page<Order>> {
    let query = Order.query(transaction)
      .select('Order.*')
      .withGraphFetched('user')
      .joinRelated('user')
      .page(params.page, params.pageSize);

    if (params.orderBy) {
      query = query.orderBy(params.orderBy, params.orderDirection);
    }

    if (params.term) {
      query = query.where(query => {
        return query
          .where('description', 'ilike', `%${params.term}%`)
          .orWhere('user.firstName', 'ilike', `%${params.term}%`)
          .orWhere('user.lastName', 'ilike', `%${params.term}%`);
      });
    }

    if (filterByUser) query = query.where('userId', filterByUser);

    const result = await query;
    return result;
  }

  public async count(transaction?: Transaction): Promise<Number> {
    const result: any = await Order.query(transaction)
      .count('id as count')
      .first();

    return Number(result.count);
  }

  public async findById(id: number, transaction?: Transaction): Promise<Order> {
    return Order.query(transaction)
      .where({ id })
      .first();
  }

  public async insert(model: IOrder, transaction: Transaction = null): Promise<Order> {
    return Order.query(transaction).insertAndFetch(model as any);
  }

  public async update(model: IOrder, transaction?: Transaction): Promise<Order> {
    return Order.query(transaction).updateAndFetchById(model.id, <Order>model);
  }

  public async remove(id: number, transaction?: Transaction): Promise<void> {
    await Order.query(transaction)
      .del()
      .where({ id });
  }
}
