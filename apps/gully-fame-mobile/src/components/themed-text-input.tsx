import { TextInput, TextInputProps, StyleSheet } from "react-native";
import { ThemedView } from "./themed-view";

interface ThemedTextInputProps extends Omit<TextInputProps, 'style'> {
  placeholder: string;
  containerStyle?: any;
}

export function ThemedTextInput({
  placeholder,
  containerStyle,
  ...props
}: ThemedTextInputProps) {
  return (
    <ThemedView style={[styles.container, containerStyle]}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#999"
        style={styles.input}
        {...props}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F9F9F9",
    marginBottom: 16,
  },
  input: {
    fontSize: 16,
    paddingVertical: 16,
    color: "#000",
  },
});
