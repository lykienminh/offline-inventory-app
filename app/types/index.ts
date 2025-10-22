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

export default {};
