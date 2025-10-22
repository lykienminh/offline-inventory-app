export type ItemId = string;

export interface Item {
  id: ItemId;
  name: string;
  category?: string;
  quantity: number;
  notes?: string;
  photoUri?: string; // file:// or base64
  updatedAt: number; // epoch ms
}

// Draft type for creating new items
export type Draft = Omit<Item, "id" | "updatedAt">;

// Patch type for updating existing items
export type Patch = Partial<Omit<Item, "id" | "updatedAt">>;

export default {};
