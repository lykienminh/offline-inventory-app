import { Item } from "@/app/types";
import { useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Draft = Omit<Item, "id" | "updatedAt">;

export default function ItemForm({
  initial,
  onSubmit,
  submitLabel = "Save",
  busy = false,
}: {
  initial?: Partial<Draft>;
  onSubmit: (draft: Draft) => void | Promise<void>;
  submitLabel?: string;
  busy?: boolean;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [quantity, setQuantity] = useState(String(initial?.quantity ?? 1));
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [photoUri, setPhotoUri] = useState<string | undefined>(initial?.photoUri);
  const [error, setError] = useState<string | null>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const valid = useMemo(() => {
    if (!name.trim()) return false;
    const q = Number(quantity);
    if (!Number.isFinite(q) || q < 0) return false;
    return true;
  }, [name, quantity]);

  const pickImage = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert("Permission needed", "Please allow photo library access to attach a photo.");
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        quality: 0.7,
      });
      if (!res.canceled) setPhotoUri(res.assets[0]?.uri);
    } catch {
      Alert.alert("Image error", "Could not pick image. You can retry later.");
    }
  };

  const takePhoto = async () => {
    try {
      // If permissions are undetermined or denied, ask for permission
      if (!cameraPermission || !cameraPermission.granted) {
        const permissionResponse = await requestCameraPermission();
        if (!permissionResponse.granted) {
          Alert.alert("Permission needed", "Please allow camera access to take a photo.");
          return;
        }
      }

      const res = await ImagePicker.launchCameraAsync({ quality: 0.7 });
      if (!res.canceled) setPhotoUri(res.assets[0]?.uri);
    } catch {
      Alert.alert("Camera error", "Could not open camera. You can retry later.");
    }
  };

  const handleSubmit = async () => {
    setError(null);
    if (!valid) {
      setError("Please enter a name and non-negative quantity.");
      return;
    }
    const q = Number(quantity);
    await onSubmit({
      name: name.trim(),
      category: category.trim() || undefined,
      quantity: q,
      notes: notes.trim() || undefined,
      photoUri,
    });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: "padding", android: undefined })} style={styles.flex}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View>
          <Text style={styles.label}>Name *</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Item name" style={styles.input} />
        </View>

        <View>
          <Text style={styles.label}>Quantity *</Text>
          <TextInput
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            placeholder="0"
            style={styles.input}
          />
        </View>

        <View>
          <Text style={styles.label}>Category</Text>
          <TextInput value={category} onChangeText={setCategory} placeholder="e.g. Groceries" style={styles.input} />
        </View>

        <View>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Optional notes"
            multiline
            style={styles.notesInput}
          />
        </View>

        <View style={styles.photoSection}>
          <Text style={styles.label}>Photo</Text>

          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photo} />
          ) : (
            <Text style={styles.noPhoto}>No photo</Text>
          )}

          <View style={styles.photoButtons}>
            <TouchableOpacity onPress={takePhoto} style={styles.cameraButton}>
              <Text style={styles.buttonText}>Take</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={pickImage} style={styles.pickButton}>
              <Text style={styles.buttonText}>Pick</Text>
            </TouchableOpacity>

            {photoUri && (
              <TouchableOpacity onPress={() => setPhotoUri(undefined)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!valid || busy}
          style={[styles.submitButton, (!valid || busy) && styles.submitButtonDisabled]}
        >
          <Text style={styles.submitButtonText}>{submitLabel}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 0,
    gap: 12,
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
  },
  photoSection: {
    gap: 8,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  noPhoto: {
    color: "#666",
  },
  photoButtons: {
    flexDirection: "row",
    gap: 8,
  },
  cameraButton: {
    backgroundColor: "#111827",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  pickButton: {
    backgroundColor: "#374151",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  removeButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  removeButtonText: {
    fontWeight: "600",
  },
  errorText: {
    color: "#dc2626",
  },
  submitButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
});
