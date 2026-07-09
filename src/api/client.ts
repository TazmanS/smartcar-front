import axios from "axios";
import { getApiUrl } from "../config";

const apiUrl = getApiUrl();

export const api = axios.create({
  baseURL: apiUrl,
  timeout: 5000,
});