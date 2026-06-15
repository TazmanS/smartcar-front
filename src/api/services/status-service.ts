import { api } from '../client'
import type { StatusResponse } from '../types/status-type';

export const getStatusService = async (): Promise<StatusResponse> => {
  const response = await api.get<StatusResponse>('/car-status');

  return response.data;
}