import { Item } from "@/app/types";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ItemRow({ item, onPress }: { item: Item; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} accessibilityRole="button" style={styles.row}>
      <View style={[styles.column, styles.nameColumn]}>
        <Text style={[styles.text, styles.nameText]} numberOfLines={2}>
          {item.name}
        </Text>
      </View>

      <View style={[styles.column, styles.categoryColumn]}>
        <Text style={[styles.text, styles.grayText]} numberOfLines={2}>
          {item.category ?? ""}
        </Text>
      </View>

      <View style={[styles.column, styles.quantityColumn]}>
        <Text style={styles.text}>{item.quantity}</Text>
      </View>

      <View style={[styles.column, styles.updatedColumn]}>
        <Text style={[styles.text, styles.grayText]}>
          {new Date(item.updatedAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })}
        </Text>
      </View>

      <View style={[styles.column, styles.photoColumn]}>
        <Text style={styles.text}>{item.photoUri ? "✓" : ""}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  column: {
    flex: 1,
    paddingHorizontal: 4,
  },
  nameColumn: {},
  categoryColumn: {},
  quantityColumn: {
    flex: 0,
    width: 40,
    alignItems: "center",
  },
  updatedColumn: {},
  photoColumn: {
    flex: 0,
    width: 40,
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    flexWrap: "wrap",
  },
  nameText: {
    fontSize: 14,
  },
  grayText: {
    color: "#555",
  },
});
