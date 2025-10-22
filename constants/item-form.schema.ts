import { Draft } from "@/app/types";
import { z } from "zod";

export const ItemFormSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  category: z.string().optional(),
  quantity: z.coerce.number().min(1, "Quantity must be greater than 0"),
  notes: z.string().optional(),
  photoUri: z.string().optional(),
});

export type ItemFormData = Draft;

export const DEFAULT_ITEM_FORM_DATA: ItemFormData = {
  name: "",
  category: "",
  quantity: 1,
  notes: "",
  photoUri: undefined,
};
