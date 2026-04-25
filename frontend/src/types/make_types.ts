export interface Make {
  id: number;
  name: string;
}

export interface MakePublic {
  id: number;
  name: string;
}

export interface MakesPublic {
  items: Make[];
  total: number;
  skip: number;
  limit: number;
}

export interface MakeCreate {
  name: string;
}
