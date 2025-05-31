import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, TextInputProps } from 'react-native';
import { inputStyles } from '~/styles/componentStyles/inputStyles';
import { pageTexts } from '~/styles/globalStyles/pageTexts';

interface PasswordInputProps extends TextInputProps {
  label: string;
  required?: boolean;
  error?: string;
  containerStyle?: object;
}

export default function PasswordInput({
  label,
  required = false,
  error,
  containerStyle,
  value,
  onChangeText,
  ...props
}: PasswordInputProps) {
  const [secure, setSecure] = useState(true);

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
          secureTextEntry={secure}
          value={value}
          onChangeText={onChangeText}
          {...props}
        />
        <TouchableOpacity onPress={() => setSecure(!secure)}>
          <Text style={{ marginLeft: 8 }}>
            {secure ? 'Mostrar' : 'Ocultar'}
          </Text>
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
