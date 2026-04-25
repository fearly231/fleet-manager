import { API_URL } from "./config";
import { MakesPublic } from "@/types/make_types";

export const makeApi = {
  getAll: async (skip = 0, limit = 100): Promise<MakesPublic> => {
    const response = await fetch(`${API_URL}/make/?skip=${skip}&limit=${limit}`);
    if (!response.ok) throw new Error(`Make GET Error: ${response.status}`);
    return response.json();
  },

  create: async (data: { name: string }) => {
    const response = await fetch(`${API_URL}/make/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Make POST Error: ${response.status}`);
    return response.json();
  },

  update: async (id: number, data: { name: string }) => {
    const response = await fetch(`${API_URL}/make/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Make PATCH Error: ${response.status}`);
    return response.json();
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_URL}/make/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(`Make DELETE Error: ${response.status}`);
    return response.json();
  }
};
