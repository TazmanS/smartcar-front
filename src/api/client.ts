import axios from "axios";

export const PATH = "/api";

export const api = axios.create({
  baseURL: PATH,
  timeout: 5000,
});

/**
 * Converts an HTTP(S) API URL to its WebSocket equivalent while preserving
 * the host, port, and API path.
 */
export const getWebSocketUrl = (url: string): string => {
  const socketUrl = new URL(url, window.location.origin);
  socketUrl.protocol = socketUrl.protocol === "https:" ? "wss:" : "ws:";
  return socketUrl.toString();
};
