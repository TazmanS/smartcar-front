import axios from "axios";

export const PATH = "/api";

export const api = axios.create({
  baseURL: PATH,
  timeout: 5000,
});
