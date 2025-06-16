import React from 'react';
import { View, Text, TextInput, TextInputProps, StyleSheet } from 'react-native';
import { colors } from '../../styles/globalStyles/colors';

interface RegisterSpaceInputProps extends TextInputProps {
  label: string;
  error?: string;
  rightIcon?: React.ReactNode;
}

const RegisterSpaceInput: React.FC<RegisterSpaceInputProps> = ({
  label,
  error,
  rightIcon,
  style,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            error && styles.inputError,
            style,
          ]}
          placeholderTextColor={colors.gray}
          {...props}
        />
        {rightIcon && (
          <View style={styles.rightIconContainer}>
            {rightIcon}
          </View>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.black,
    borderWidth: 1,
    borderColor: colors.light_gray,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 4,
  },
  rightIconContainer: {
    position: 'absolute',
    right: 16,
    height: '100%',
    justifyContent: 'center',
  },
});

export default RegisterSpaceInput; 