import useInventoryStore from "@/app/store/useItems";
import { Item } from "@/app/types";
import React, { useMemo } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ItemRow from "./ItemRow";

type Props = {
  onPressRow?: (item: Item) => void;
};

export default function Table({ onPressRow }: Props) {
  const { items, sortBy, sortDir, setSort, search } = useInventoryStore();

  const filteredSorted = useMemo(() => {
    const byName = (a: Item, b: Item) => a.name.localeCompare(b.name);
    const byUpdated = (a: Item, b: Item) => a.updatedAt - b.updatedAt;
    const data = items.filter((it) => it.name.toLowerCase().includes(search.toLowerCase()));
    const sorter = sortBy === "name" ? byName : byUpdated;
    const sorted = [...data].sort(sorter);
    return sortDir === "asc" ? sorted : sorted.reverse();
  }, [items, sortBy, sortDir, search]);

  const SortHeader = ({ label, by }: { label: string; by: "name" | "updatedAt" }) => (
    <TouchableOpacity
      onPress={() => setSort(by)}
      style={[styles.columnHeader, by === "name" ? styles.nameHeader : styles.updatedHeader]}
    >
      <Text style={styles.headerText}>
        {label}
        {sortBy === by ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <SortHeader label="Name" by="name" />
        <View style={[styles.columnHeader, styles.categoryHeader]}>
          <Text style={styles.headerText}>Category</Text>
        </View>
        <View style={[styles.columnHeader, styles.qtyHeader]}>
          <Text style={styles.headerText}>Qty</Text>
        </View>
        <SortHeader label="Updated" by="updatedAt" />
        <View style={[styles.columnHeader, styles.photoHeader]}>
          <Text style={styles.headerText}>Pic</Text>
        </View>
      </View>

      <FlatList
        data={filteredSorted}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ItemRow item={item} onPress={() => onPressRow?.(item)} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: "#e5e5e5",
  },
  columnHeader: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  headerText: {
    fontWeight: "700",
    fontSize: 16,
  },
  nameHeader: {},
  categoryHeader: {},
  qtyHeader: {
    flex: 0,
    width: 40,
    alignItems: "flex-start",
  },
  updatedHeader: {},
  photoHeader: {
    flex: 0,
    width: 40,
  },
  listContent: {
    paddingHorizontal: 8,
  },
});
