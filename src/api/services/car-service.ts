import { api } from "../client";
import type { TCarAction } from "../types/car-action-type";

export type Car = {
  id: string;
  name: string;
  last_seen?: string;
  created_at?: string;
  updated_at?: string;
};

export type GetCarsListRequest = {
  page: number;
  per_page: number;
  search: string;
  sort_by: string;
  order: "asc" | "desc";
};

type ApiRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is ApiRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const unwrapList = (value: unknown): unknown[] => {
  if (Array.isArray(value)) return value;
  if (!isRecord(value)) return [];

  const list = value.cars ?? value.data ?? value.items ?? value.results;
  return Array.isArray(list) ? list : [];
};

const normaliseCar = (value: unknown): Car | null => {
  if (!isRecord(value)) return null;

  const rawId = value.id ?? value.car_id ?? value.carId;
  if (typeof rawId !== "string" && typeof rawId !== "number") return null;

  const rawName = value.name;
  return {
    id: String(rawId),
    name: typeof rawName === "string" ? rawName : `Car ${rawId}`,
    last_seen: typeof value.last_seen === "string" ? value.last_seen : undefined,
    created_at: typeof value.created_at === "string" ? value.created_at : undefined,
    updated_at: typeof value.updated_at === "string" ? value.updated_at : undefined,
  };
};

export const getCars = async (
  request: GetCarsListRequest,
): Promise<Car[]> => {
  const response = await api.post("/cars/list", request);
  return unwrapList(response.data)
    .map(normaliseCar)
    .filter((car): car is Car => car !== null);
};

export const getCarInfo = async (carId: string): Promise<Car> => {
  const response = await api.get(`/cars/${encodeURIComponent(carId)}/info`);
  const data = isRecord(response.data) && isRecord(response.data.data)
    ? response.data.data
    : response.data;
  return normaliseCar(data) ?? { id: carId, name: `Car ${carId}` };
};

export const sendCarAction = async (
  carId: string,
  command: TCarAction,
): Promise<unknown> => {
  const response = await api.post("/car-actions", { car_id: carId, action: command });
  return response.data;
};
