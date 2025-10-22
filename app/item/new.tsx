import useInventoryStore from "@/app/store/useItems";
import ItemForm from "@/components/ItemForm";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";

export default function NewItemScreen() {
  const router = useRouter();
  const add = useInventoryStore((state) => state.add);
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
    <>
      <Stack.Screen
        options={{
          title: "Add Item",
          headerBackTitle: "Back",
        }}
      />
      <View className="flex-1">
        <ItemForm onSubmit={onSubmit} submitLabel="Create" busy={busy} />
      </View>
    </>
  );
}
