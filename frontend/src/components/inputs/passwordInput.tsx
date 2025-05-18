import { useState } from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { inputStyles } from '~/styles/componentStyles/inputStyles';
import { pageTexts } from '~/styles/globalStyles/pageTexts';

interface PasswordInputProps extends TextInputProps {
  label: string;
  required?: boolean;
  error?: string;
  containerStyle?: object;
}

export default function PasswordInput({ label, required, error, containerStyle, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[inputStyles.container, containerStyle]}>
      <View style={inputStyles.labelContainer}>
        <Text style={pageTexts.labelInput}>{label}</Text>
        {required && <Text style={inputStyles.required}>*</Text>}
      </View>

      <View style={inputStyles.inputContainer}>
        <TextInput
          style={inputStyles.input}
          placeholderTextColor="#A0A0A0"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          {...props}
        />
        <TouchableOpacity
          style={inputStyles.iconContainer}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={20}
            color="#A0A0A0"
          />
        </TouchableOpacity>
      </View>

      {/* Error message */}
      {error && (
        <View style={inputStyles.errorContainer}>
          <Text style={inputStyles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
} 
