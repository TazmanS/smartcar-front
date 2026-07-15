import { api } from '../client'
import type { TCarAction } from '../types/car-action-type';

export const sendCarAction = async (command: TCarAction): Promise<any> => {
  const response = await api.post('/car-actions', {action: command});

  return response.data;
}