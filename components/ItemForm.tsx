import { Draft } from "@/app/types";
import { DEFAULT_ITEM_FORM_DATA, ItemFormData, ItemFormSchema } from "@/constants/item-form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Controller, useForm } from "react-hook-form";
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
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<ItemFormData>({
    resolver: zodResolver(ItemFormSchema),
    defaultValues: {
      ...DEFAULT_ITEM_FORM_DATA,
      ...initial,
    },
    mode: "onChange",
  });

  const watchedPhotoUri = watch("photoUri");

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
      if (!res.canceled) {
        const uri = res.assets[0]?.uri;
        setValue("photoUri", uri);
      }
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
      if (!res.canceled) {
        const uri = res.assets[0]?.uri;
        setValue("photoUri", uri);
      }
    } catch {
      Alert.alert("Camera error", "Could not open camera. You can retry later.");
    }
  };

  const onFormSubmit = async (data: ItemFormData) => {
    await onSubmit({
      name: data.name,
      category: data.category || undefined,
      quantity: data.quantity,
      notes: data.notes || undefined,
      photoUri: data.photoUri,
    });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: "padding", android: undefined })} style={styles.flex}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View>
          <Text style={styles.label}>Name *</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Item name"
                style={[styles.input, errors.name && styles.inputError]}
              />
            )}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
        </View>

        <View>
          <Text style={styles.label}>Quantity *</Text>
          <Controller
            control={control}
            name="quantity"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                value={String(value)}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="numeric"
                placeholder="0"
                style={[styles.input, errors.quantity && styles.inputError]}
              />
            )}
          />
          {errors.quantity && <Text style={styles.errorText}>{errors.quantity.message}</Text>}
        </View>

        <View>
          <Text style={styles.label}>Category</Text>
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="e.g. Groceries"
                style={styles.input}
              />
            )}
          />
        </View>

        <View>
          <Text style={styles.label}>Notes</Text>
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Optional notes"
                multiline
                style={styles.notesInput}
              />
            )}
          />
        </View>

        <View style={styles.photoSection}>
          <Text style={styles.label}>Photo</Text>

          {watchedPhotoUri ? (
            <Image source={{ uri: watchedPhotoUri }} style={styles.photo} />
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

            {watchedPhotoUri && (
              <TouchableOpacity
                onPress={() => {
                  setValue("photoUri", undefined);
                }}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSubmit(onFormSubmit)}
          disabled={!isValid || busy}
          style={[styles.submitButton, (!isValid || busy) && styles.submitButtonDisabled]}
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
  inputError: {
    borderColor: "#dc2626",
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
