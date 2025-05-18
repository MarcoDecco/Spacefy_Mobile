import { View, Text, TextInput, TextInputProps } from 'react-native';
import { inputStyles } from '~/styles/componentStyles/inputStyles';
import { pageTexts } from '~/styles/globalStyles/pageTexts';

interface BaseInputProps extends TextInputProps {
  label: string;
  required?: boolean;
  error?: string;
  containerStyle?: object;
}

export default function BaseInput({ label, required = false, error, containerStyle, ...props }: BaseInputProps) {
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
                {...props}
            />
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
