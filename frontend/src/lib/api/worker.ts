import { API_URL } from "./config";

export const workerApi = {
  getAll: async () => {
    return { message: "All Workers fetched successfully" };
  },
};