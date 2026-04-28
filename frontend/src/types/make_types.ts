export interface MakeBase {
	name: string;
}

export interface MakePublic extends MakeBase {
	id: number;
}

export interface MakeCreate extends MakeBase {}

// changes all from MakeBase to be optional
export type MakeUpdate = Partial<MakeBase>;

export interface MakesPublic {
	items: MakePublic[];
	total: number;
	skip: number;
	limit: number;
}
