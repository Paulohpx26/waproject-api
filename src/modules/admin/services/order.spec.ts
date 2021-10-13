import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { IOrder } from 'modules/database/interfaces/order';

import { OrderRepository } from '../repositories/order';
import { OrderService } from './order';

/* eslint-disable max-len */
describe('Admin/OrderService', () => {
  let orderRepository: OrderRepository;
  let service: OrderService;

  const order: IOrder = {
    description: 'description',
    userId: 1,
    amount: 1,
    total: 100
  };

  beforeEach(async () => {
    orderRepository = new OrderRepository();

    service = new OrderService(orderRepository);
  });

  it('should list orders with pagination with admin session user', async () => {
    jest.spyOn(orderRepository, 'list').mockResolvedValue(Promise.resolve([{ ...order }] as any));

    const result = await service.list({ page: 1, pageSize: 20 }, { id: 2, roles: ['admin'] } as any);

    expect(result).not.toBeFalsy();
    expect(result).toEqual([order]);
  });

  it('should list orders with pagination with non-admin user session', async () => {
    jest.spyOn(orderRepository, 'list').mockResolvedValue(Promise.resolve([{ ...order }] as any));

    const result = await service.list({ page: 1, pageSize: 20 }, { id: 1, roles: ['user'] } as any);

    expect(result).not.toBeFalsy();
    expect(result).toEqual([order]);
  });

  it('should find order by id with an admin user session', async () => {
    jest.spyOn(orderRepository, 'findById').mockResolvedValueOnce({ ...order } as any);

    const result = await service.findById(1, { id: 2, roles: ['admin'] } as any);

    expect(result).not.toBeFalsy();
    expect(result).toEqual(order);
  });

  it('should find order by id with the session of the same user who created it', async () => {
    jest.spyOn(orderRepository, 'findById').mockResolvedValueOnce({ ...order } as any);

    const result = await service.findById(1, { id: 1, roles: ['user'] } as any);

    expect(result).not.toBeFalsy();
    expect(result).toEqual(order);
  });

  it('should throw ForbiddenException when try find an order with a session that is not the same as the user who created it or with a non-admin user session', async () => {
    jest.spyOn(orderRepository, 'findById').mockResolvedValueOnce({ userId: 2 } as any);

    try {
      await service.findById(2, { id: 1, roles: ['user'] } as any);
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(ForbiddenException);
    }
  });

  it('should create an order', async () => {
    jest.spyOn(orderRepository, 'insert').mockImplementationOnce(order => Promise.resolve({ ...order } as any));

    const result = await service.save(order, { id: 1, roles: ['user'] } as any);

    expect(result).not.toBeFalsy();
    expect(result).toEqual(order);
  });

  it('should update an order with an admin user session', async () => {
    jest.spyOn(orderRepository, 'findById').mockResolvedValueOnce({ userId: 1 } as any);
    jest.spyOn(orderRepository, 'update').mockImplementationOnce(order => Promise.resolve({ ...order } as any));

    const result = await service.save({ id: 1, ...order }, { id: 2, roles: ['admin'] } as any);

    expect(result).not.toBeFalsy();
    expect(result).toEqual({ id: 1, ...order });
  });

  it('should update an order with the session of the same user who created it', async () => {
    jest.spyOn(orderRepository, 'findById').mockResolvedValueOnce({ userId: 1 } as any);
    jest.spyOn(orderRepository, 'update').mockImplementationOnce(order => Promise.resolve({ ...order } as any));

    const result = await service.save({ id: 1, ...order }, { id: 1, roles: ['user'] } as any);

    expect(result).not.toBeFalsy();
    expect(result).toEqual({ id: 1, ...order });
  });

  it('should throw ForbiddenException when try update an order with a session that is not the same as the user who created it or with a non-admin user session', async () => {
    jest.spyOn(orderRepository, 'findById').mockResolvedValueOnce({ userId: 2 } as any);
    jest.spyOn(orderRepository, 'update').mockImplementationOnce(order => Promise.resolve({ ...order } as any));

    try {
      await service.save({ id: 1, ...order }, { id: 1, roles: ['user'] } as any);
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(ForbiddenException);
    }
  });

  it('should throw NotFoundException when try update a not found order', async () => {
    jest.spyOn(orderRepository, 'findById').mockResolvedValueOnce(null);

    try {
      await service.save({ id: 1, ...order }, { id: 1, roles: ['admin'] } as any);
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });

  it('should remove an order with an admin user session', async () => {
    jest.spyOn(orderRepository, 'findById').mockResolvedValueOnce({ id: 2 } as any);
    jest.spyOn(orderRepository, 'remove').mockResolvedValueOnce({ id: 2 } as any);

    await service.remove(2, { id: 1, roles: ['admin'] } as any);
  });

  it('should remove an order with the session of the same user who created it', async () => {
    jest.spyOn(orderRepository, 'findById').mockResolvedValueOnce({ id: 2, userId: 1 } as any);
    jest.spyOn(orderRepository, 'remove').mockResolvedValueOnce({ id: 2 } as any);

    await service.remove(2, { id: 1, roles: ['user'] } as any);
  });

  it('should throw ForbiddenException when try remove an order with a session that is not the same as the user who created it or with a non-admin user session', async () => {
    jest.spyOn(orderRepository, 'findById').mockResolvedValueOnce({ userId: 2 } as any);
    jest.spyOn(orderRepository, 'update').mockImplementationOnce(order => Promise.resolve({ ...order } as any));

    try {
      await service.save({ id: 1, ...order }, { id: 1, roles: ['user'] } as any);
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(ForbiddenException);
    }
  });

  it('should throw NotFoundException when try remove a not found order', async () => {
    jest.spyOn(orderRepository, 'findById').mockResolvedValueOnce(null);

    try {
      await service.remove(1, { id: 1, roles: ['admin'] } as any);
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });
});
