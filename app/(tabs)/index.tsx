import useInventoryStore from "@/app/store/useItems";
import Table from "@/components/Table";
import { useRouter } from "expo-router";
import React from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);
  const search = useInventoryStore((state) => state.search);
  const setSearch = useInventoryStore((state) => state.setSearch);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inner}>
          <View style={styles.header}>
            <Text style={styles.title}>Inventory</Text>
            <TouchableOpacity
              onPress={() => router.push("/item/new")}
              style={styles.addButton}
              accessibilityRole="button"
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Search by name"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />

          <View style={styles.spacer} />

          <View style={styles.tableWrapper}>
            <Table onPressRow={(item) => router.push({ pathname: "/item/[id]", params: { id: item.id } })} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scroll: {
    flex: 1,
  },
  inner: {
    padding: 16,
    paddingTop: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
  },
  addButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  searchInput: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  spacer: {
    height: 16,
  },
  tableWrapper: {
    flex: 1,
  },
});
