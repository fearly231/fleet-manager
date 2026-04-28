export interface VehModelBase {
	name: string;
	make_id: number;
}

export interface VehModelPublic extends VehModelBase {
	id: number;
	make_name: string;
}

export interface VehModelCreate extends VehModelBase {}

export type VehModelUpdate = Partial<VehModelBase>;

export interface VehModelsPublic {
	items: VehModelPublic[];
	total: number;
	skip: number;
	limit: number;
}
