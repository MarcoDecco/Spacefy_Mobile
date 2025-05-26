import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/globalStyles/colors';
import { settingItemStyles as styles } from '../../styles/settingItem.styles';
import { useTheme } from '../../contexts/ThemeContext';

interface SettingItemProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  type: 'toggle' | 'navigate' | 'action';
  value?: boolean;
  onPress?: () => void;
}

export function SettingItem({ title, icon, type, value, onPress }: SettingItemProps) {
  const { theme, isDarkMode } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.settingItem,
        { 
          borderBottomColor: isDarkMode ? theme.dark_gray : theme.border,
          borderBottomWidth: isDarkMode ? 0.5 : 1
        }
      ]}
      onPress={type === 'toggle' ? undefined : onPress}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color={theme.blue} />
        <Text style={[styles.settingText, { color: theme.text }]}>{title}</Text>
      </View>
      {type === 'toggle' ? (
        <Switch
          value={value}
          onValueChange={onPress}
          trackColor={{ false: theme.gray, true: theme.blue }}
          thumbColor={value ? theme.white : theme.white}
        />
      ) : (
        <Ionicons name="chevron-forward" size={24} color={theme.gray} />
      )}
    </TouchableOpacity>
  );
} 