import useInventoryStore from "@/app/store/useItems";
import ItemForm from "@/components/ItemForm";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";

export default function NewItemScreen() {
  const router = useRouter();
  const { add } = useInventoryStore();
  const [busy, setBusy] = useState(false);

  const onSubmit = async (draft: Parameters<typeof add>[0]) => {
    setBusy(true);
    try {
      await add(draft);
      router.back();
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ItemForm onSubmit={onSubmit} submitLabel="Create" busy={busy} />
    </View>
  );
}
