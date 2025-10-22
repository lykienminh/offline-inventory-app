import useInventoryStore from "@/app/store/useItems";
import ItemForm from "@/components/ItemForm";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

export default function EditItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const items = useInventoryStore((state) => state.items);
  const update = useInventoryStore((state) => state.update);
  const remove = useInventoryStore((state) => state.remove);

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

  const handleDelete = () => {
    Alert.alert("Delete Item", `Are you sure you want to delete "${item.name}"? This action cannot be undone.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setBusy(true);
          try {
            await remove(item.id);
            router.back();
          } finally {
            setBusy(false);
          }
        },
      },
    ]);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Edit Item",
          headerBackTitle: "Back",
          headerRight: () => (
            <TouchableOpacity
              onPress={handleDelete}
              disabled={busy}
              className={`bg-red-600 px-3 py-1.5 rounded mr-2 ${busy ? 'bg-gray-400' : ''}`}
            >
              <Text className="text-white font-semibold text-sm">Delete</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View className="flex-1">
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
    </>
  );
}
