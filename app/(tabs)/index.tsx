import useInventoryStore from "@/app/store/useItems";
import Table from "@/components/Table";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);
  const search = useInventoryStore((state) => state.search);
  const setSearch = useInventoryStore((state) => state.setSearch);

  // Local state for the input value
  const [inputValue, setInputValue] = useState(search);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedSearch = useCallback(
    (value: string) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        setSearch(value);
      }, 500);
    },
    [setSearch]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setInputValue(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        keyboardShouldPersistTaps="handled"
      >
        <View className="p-4 pt-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-2xl font-extrabold">Inventory</Text>
            <TouchableOpacity
              onPress={() => router.push("/item/new")}
              className="bg-blue-600 py-2.5 px-3.5 rounded-lg"
              accessibilityRole="button"
            >
              <Text className="text-white font-bold">Add</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Search by name"
            value={inputValue}
            onChangeText={handleSearchChange}
            className="border border-gray-300 rounded-lg p-3"
          />

          <View className="h-4" />

          <View className="flex-1">
            <Table onPressRow={(item) => router.push({ pathname: "/item/[id]", params: { id: item.id } })} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
