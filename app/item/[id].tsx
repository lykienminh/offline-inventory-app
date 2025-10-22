import useInventoryStore from "@/app/store/useItems";
import ItemForm from "@/components/ItemForm";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
          headerRight: () => (
            <TouchableOpacity
              onPress={handleDelete}
              disabled={busy}
              style={[styles.headerDeleteButton, busy && styles.headerDeleteButtonDisabled]}
            >
              <Text style={styles.headerDeleteButtonText}>Delete</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerDeleteButton: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  headerDeleteButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  headerDeleteButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
