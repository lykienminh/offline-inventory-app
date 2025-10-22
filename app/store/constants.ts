import { Item } from "../types";

export const MOCK_ITEMS: Item[] = [
  {
    id: "item-001",
    name: "Apples",
    category: "Fruits",
    quantity: 10,
    notes: "Green Granny Smith apples",
    photoUri: "file://photos/apples.jpg",
    updatedAt: 1698075600000,
  },
  {
    id: "item-002",
    name: "Toothbrush",
    category: "Toiletries",
    quantity: 2,
    updatedAt: 1698158400000,
  },
  {
    id: "item-003",
    name: "Notebook",
    category: "Stationery",
    quantity: 5,
    notes: "A5 size, ruled",
    updatedAt: 1698244800000,
  },
  {
    id: "item-004",
    name: "Canned Beans",
    quantity: 12,
    notes: "Expires Dec 2026",
    photoUri: "file://photos/beans.jpg",
    updatedAt: 1698331200000,
  },
  {
    id: "item-005",
    name: "LED Light Bulb",
    category: "Electronics",
    quantity: 4,
    photoUri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...",
    updatedAt: 1698417600000,
  },
];

export default {};
