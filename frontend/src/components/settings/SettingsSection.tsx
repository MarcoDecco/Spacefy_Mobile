import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SettingItem } from './SettingItem';
import { useTheme } from '../../contexts/ThemeContext';
import { settingsStyles as styles } from '../../styles/settings.styles';

interface SettingsSectionProps {
  title: string;
  items: Array<{
    id: string;
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    type: 'toggle' | 'navigate' | 'action';
    value?: boolean;
    onPress?: () => void;
  }>;
}

export function SettingsSection({ title, items }: SettingsSectionProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.section, { backgroundColor: theme.card }]}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
      {items.map((item, index) => (
        <SettingItem
          key={item.id}
          title={item.title}
          icon={item.icon}
          type={item.type}
          value={item.value}
          onPress={item.onPress}
        />
      ))}
    </View>
  );
} 