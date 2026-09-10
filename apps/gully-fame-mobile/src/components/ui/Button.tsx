import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  StyleProp, 
  ViewStyle, 
  TextStyle 
} from 'react-native';

// Blueprint Colors: Primary (#E91E63), Background (#121212)
const PRIMARY_COLOR = '#E91E63'; 
const DISABLED_COLOR = '#444';
const WHITE = '#FFFFFF';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

/**
 * A reusable Button component adhering to the Gully Fame Design System.
 * In a real blueprint implementation, this would use Tailwind/Styled Components 
 * and Poppins font family.
 */
export const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  disabled = false, 
  loading = false, 
  style, 
  textStyle 
}) => {
  
  const buttonOpacity = disabled || loading ? 0.6 : 1;
  const backgroundColor = disabled || loading ? DISABLED_COLOR : PRIMARY_COLOR;

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor, opacity: buttonOpacity }, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={WHITE} size="small" />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 12, // Slightly more rounded corners for mobile aesthetic
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    // Shadow for visual depth
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  text: {
    color: WHITE,
    fontSize: 16,
    // fontWeight removed - using fontFamily instead
  },
});