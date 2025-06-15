import { View, Text, TextInput, TextInputProps } from 'react-native';
import { inputStyles } from '~/styles/componentStyles/inputStyles';
import { pageTexts } from '~/styles/globalStyles/pageTexts';

interface RegisterSpaceInputProps extends TextInputProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  containerStyle?: object;
}

export default function RegisterSpaceInput({
  label,
  required = false,
  error,
  hint,
  containerStyle,
  value,
  onChangeText,
  ...props
}: RegisterSpaceInputProps) {
  return (
    <View style={[inputStyles.container, containerStyle]}>
      <View style={inputStyles.labelContainer}>
        <Text style={pageTexts.labelInput}>{label}</Text>
        {required && <Text style={inputStyles.required}>*</Text>}
        {hint && <Text style={{ fontSize: 12, color: '#888', marginLeft: 8 }}>{hint}</Text>}
      </View>
      <View style={inputStyles.inputContainer}>
        <TextInput
          style={[
            inputStyles.input,
            inputStyles.registerSpaceInput,
            props.multiline && { minHeight: 60, textAlignVertical: 'top' },
            props.style,
          ]}
          placeholderTextColor="#A0A0A0"
          value={value}
          onChangeText={onChangeText}
          {...props}
        />
      </View>
      {error && (
        <View style={inputStyles.errorContainer}>
          <Text style={inputStyles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
} 