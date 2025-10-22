import useInventoryStore from "@/app/store/useItems";
import ItemForm from "@/components/ItemForm";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { View } from "react-native";

export default function EditItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { items, update, remove } = useInventoryStore();
  const [busy, setBusy] = useState(false);

  const item = useMemo(() => items.find((it) => it.id === id), [items, id]);

  if (!item) return null;

  const onSubmit = async (draft: Omit<typeof item, "id" | "updatedAt">) => {
    setBusy(true);
    try {
      await update(item.id, draft);
      router.back();
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ItemForm
        initial={{
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          notes: item.notes,
          photoUri: item.photoUri,
        }}
        onSubmit={onSubmit as any}
        submitLabel="Save"
        busy={busy}
      />
    </View>
  );
}
