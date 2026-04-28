import type {
	VehModelCreate,
	VehModelPublic,
	VehModelsPublic,
	VehModelUpdate,
} from "@/types/vehmodel_types";
import { API_URL } from "./config";

export const vehmodelApi = {
	getAll: async (skip = 0, limit = 100): Promise<VehModelsPublic> => {
		const response = await fetch(`${API_URL}/model/?skip=${skip}&limit=${limit}`);
		if (!response.ok)
			throw new Error(`Vehicle Model GET Error: ${response.status}`);
		return response.json();
	},

	create: async (data: VehModelCreate): Promise<VehModelPublic> => {
		const response = await fetch(`${API_URL}/model/`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			const errorData = await response.json();
			if (response.status === 422 && errorData.detail) {
				const ValidationMessage = errorData.detail[0].msg;
				throw new Error(`Validation Error: ${ValidationMessage}`);
			}
			throw new Error(`Failed to create Vehicle Model: ${response.status}`);
		}
		return response.json();
	},

	update: async (id: number, data: VehModelUpdate): Promise<VehModelPublic> => {
		const response = await fetch(`${API_URL}/model/${id}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			const errorData = await response.json();
			if (response.status === 422 && errorData.detail) {
				const ValidationMessage = errorData.detail[0].msg;
				throw new Error(`Validation Error: ${ValidationMessage}`);
			}
			throw new Error(`Failed to update Vehicle Model: ${response.status}`);
		}
		return response.json();
	},

	delete: async (id: number) => {
		const response = await fetch(`${API_URL}/model/${id}`, {
			method: "DELETE",
		});
		if (!response.ok) {
			const errorData = await response.json();
			if (response.status === 409) {
				const conflictMessage = errorData.detail || "Database integration error";
				throw new Error(`${conflictMessage}`);
			}
			throw new Error(`Vehicle model DELETE Error: ${response.status}`);
		}
		return response.json();
	},
};
