import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { styles } from '../styles/spaceRegisterStyles/etapa7Styles';
import { colors } from '../styles/globalStyles/colors';

interface CampoTextoProps {
  titulo: string;
  value: string;
  onChange: (e: { target: { name: string; value: string } }) => void;
  name: string;
}

export const CampoTexto: React.FC<CampoTextoProps> = ({ titulo, value, onChange, name }) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{titulo}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={(text) => onChange({ target: { name, value: text } })}
        placeholder={`Digite ${titulo.toLowerCase()}`}
        placeholderTextColor={colors.gray}
      />
    </View>
  );
}; 