import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../styles/globalStyles/colors';
import { registerSpaceButtonStyles } from '../../styles/componentStyles/buttonStyles';
import { useTheme } from '../../contexts/ThemeContext';

interface RegisterSpaceButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export default function RegisterSpaceButton({
  title,
  onPress,
  style,
  textStyle,
  variant = 'primary',
  disabled = false,
}: RegisterSpaceButtonProps) {
  const { isDarkMode, theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        registerSpaceButtonStyles.button,
        variant === 'secondary' 
          ? [
              registerSpaceButtonStyles.secondary,
              isDarkMode && { 
                backgroundColor: theme.card,
                borderColor: theme.blue 
              }
            ] 
          : registerSpaceButtonStyles.primary,
        disabled && registerSpaceButtonStyles.disabled,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={[
        registerSpaceButtonStyles.text,
        variant === 'secondary' 
          ? [
              registerSpaceButtonStyles.secondaryText,
              isDarkMode && { color: theme.blue }
            ] 
          : {},
        textStyle,
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
} 