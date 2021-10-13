import { IUser } from './user';

export interface IOrder {
  id?: number;
  userId?: number;
  description: string;
  amount: number;
  total: number;

  user?: IUser;
}
