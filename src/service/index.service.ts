import axios from "axios";
import { getSession } from "next-auth/react";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const session = await getSession();
      if (session?.accessToken && config.headers) {
        (config.headers as Record<string, string>)[
          "Authorization"
        ] = `Bearer ${session.accessToken}`;
      }
    } catch (error) {
      console.warn("Failed to get session token:", error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
