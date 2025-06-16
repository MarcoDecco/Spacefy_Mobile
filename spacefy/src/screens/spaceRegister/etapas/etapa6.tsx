import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../../styles/spaceRegisterStyles/etapa6Styles';
import { colors } from '../../../styles/globalStyles/colors';
import { ProgressBar } from '../../../components/ProgressBar';
import { useSpaceRegister } from '../../../contexts/SpaceRegisterContext';
import { NavigationButtons } from '../../../components/buttons/NavigationButtons';

// Array com todas as categorias e seus itens
const CATEGORIAS = [
  {
    titulo: 'Acessibilidade',
    icon: 'accessibility',
    itens: [
      { id: 'estacionamento', label: 'Estacionamento', icon: 'car' },
      { id: 'bicicletario', label: 'Bicicletário', icon: 'bicycle' },
      { id: 'ponto_transporte', label: 'Ponto de Transporte', icon: 'bus' },
      { id: 'acesso_pcd', label: 'Acesso para PCD', icon: 'walk' },
      { id: 'elevador', label: 'Elevador', icon: 'arrow-up' },
      { id: 'rampa_acesso', label: 'Rampa de Acesso', icon: 'trending-up' },
      { id: 'banheiro_pcd', label: 'Banheiro Adaptado', icon: 'male-female' },
    ],
  },
  {
    titulo: 'Segurança',
    icon: 'shield-checkmark',
    itens: [
      { id: 'cameras', label: 'Cameras de segurança', icon: 'videocam' },
      { id: 'alarme', label: 'Sistema de alarme', icon: 'warning' },
      { id: 'combate_incendio', label: 'Sistema de combate a incêndios', icon: 'water' },
      { id: 'iluminacao_emergencia', label: 'Iluminação de emergência', icon: 'flash' },
      { id: 'guarita', label: 'Guarita de Segurança', icon: 'shield' },
      { id: 'controle_acesso', label: 'Controle de Acesso', icon: 'key' },
      { id: 'monitoramento_24h', label: 'Monitoramento 24h', icon: 'time' },
    ],
  },
  {
    titulo: 'Conforto e Infraestrutura',
    icon: 'home',
    itens: [
      { id: 'ar_condicionado', label: 'Ar-condicionado', icon: 'snow' },
      { id: 'cadeiras', label: 'Cadeiras', icon: 'person' },
      { id: 'mesas', label: 'Mesas', icon: 'desktop' },
      { id: 'palco', label: 'Palco/Espaço Elevado', icon: 'podium' },
      { id: 'som', label: 'Sistema de som', icon: 'volume-high' },
      { id: 'microfones', label: 'Microfones', icon: 'mic' },
      { id: 'banheiros', label: 'Banheiros', icon: 'water' },
      { id: 'vestiarios', label: 'Vestiários', icon: 'shirt' },
      { id: 'chuveiros', label: 'Chuveiros', icon: 'water' },
      { id: 'armarios', label: 'Armários', icon: 'archive' },
      { id: 'espelho', label: 'Espelhos', icon: 'albums' },
      { id: 'ventiladores', label: 'Ventiladores', icon: 'sync' },
      { id: 'aquecimento', label: 'Sistema de Aquecimento', icon: 'flame' },
      { id: 'acustica', label: 'Tratamento Acústico', icon: 'volume-medium' },
      { id: 'iluminacao_cenica', label: 'Iluminação Cênica', icon: 'bulb' },
    ],
  },
  {
    titulo: 'Alimentação e Conveniência',
    icon: 'restaurant',
    itens: [
      { id: 'cafeteira', label: 'Máquina de Café', icon: 'cafe' },
      { id: 'bebedouro', label: 'Bebedouro', icon: 'water' },
      { id: 'cozinha', label: 'Cozinha', icon: 'restaurant' },
      { id: 'loucas', label: 'Louças', icon: 'wine' },
      { id: 'talheres', label: 'Talheres', icon: 'restaurant' },
      { id: 'fogao', label: 'Fogão', icon: 'flame' },
      { id: 'forno', label: 'Forno', icon: 'flame' },
      { id: 'microondas', label: 'Micro-ondas', icon: 'flash' },
      { id: 'churrasqueira', label: 'Churrasqueira', icon: 'flame' },
      { id: 'geladeira', label: 'Geladeira', icon: 'snow' },
      { id: 'freezer', label: 'Freezer', icon: 'snow' },
      { id: 'pia', label: 'Pia', icon: 'water' },
      { id: 'mesa_bar', label: 'Mesa de Bar', icon: 'wine' },
      { id: 'buffet', label: 'Área de Buffet', icon: 'restaurant' },
    ],
  },
  {
    titulo: 'Equipamentos e Tecnologia',
    icon: 'hardware-chip',
    itens: [
      { id: 'wifi', label: 'Wi-Fi', icon: 'wifi' },
      { id: 'projetor', label: 'Projetor', icon: 'videocam' },
      { id: 'tela_projecao', label: 'Tela de Projeção', icon: 'tv' },
      { id: 'som_tecnologia', label: 'Sistema de Som', icon: 'volume-high' },
      { id: 'microfones_tecnologia', label: 'Microfones', icon: 'mic' },
      { id: 'equipamentos_auxiliares', label: 'Equipamentos Auxiliares', icon: 'construct' },
      { id: 'computador', label: 'Computador', icon: 'desktop' },
      { id: 'tv', label: 'TV', icon: 'tv' },
      { id: 'video_conferencia', label: 'Videoconferência', icon: 'videocam' },
      { id: 'impressora', label: 'Impressora', icon: 'print' },
      { id: 'scanner', label: 'Scanner', icon: 'scan' },
      { id: 'tomadas_220v', label: 'Tomadas 220V', icon: 'flash' },
      { id: 'gerador', label: 'Gerador', icon: 'flash' },
    ],
  },
  {
    titulo: 'Áreas Externas',
    icon: 'leaf',
    itens: [
      { id: 'jardim', label: 'Jardim', icon: 'leaf' },
      { id: 'deck', label: 'Deck', icon: 'home' },
      { id: 'piscina', label: 'Piscina', icon: 'water' },
      { id: 'quadra', label: 'Quadra', icon: 'basketball' },
      { id: 'playground', label: 'Playground', icon: 'game-controller' },
      { id: 'varanda', label: 'Varanda', icon: 'home' },
      { id: 'terraco', label: 'Terraço', icon: 'home' },
      { id: 'estacionamento_coberto', label: 'Estacionamento Coberto', icon: 'car' },
    ],
  },
];

interface CheckboxItemProps {
  item: {
    id: string;
    label: string;
    icon: string;
  };
  checked: boolean;
  onChange: (id: string, checked: boolean) => void;
}

const CheckboxItem: React.FC<CheckboxItemProps> = ({ item, checked, onChange }) => (
  <TouchableOpacity
    style={[styles.itemContainer, checked && styles.itemContainerSelected]}
    onPress={() => onChange(item.id, !checked)}
  >
    <View style={styles.itemContent}>
      <View style={[styles.itemIconContainer, checked && styles.itemIconContainerSelected]}>
        <Ionicons
          name={item.icon as any}
          size={20}
          color={checked ? colors.blue : colors.dark_gray}
        />
      </View>
      <Text style={[styles.itemLabel, checked && styles.itemLabelSelected]}>
        {item.label}
      </Text>
    </View>
    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
      {checked && <Ionicons name="checkmark" size={16} color={colors.white} />}
    </View>
  </TouchableOpacity>
);

interface CategoriaProps {
  titulo: string;
  icon: string;
  itens: Array<{
    id: string;
    label: string;
    icon: string;
  }>;
  checkedItems: string[];
  onChange: (id: string, checked: boolean) => void;
}

const Categoria: React.FC<CategoriaProps> = ({ titulo, icon, itens, checkedItems, onChange }) => (
  <View style={styles.categorySection}>
    <View style={styles.categoryHeader}>
      <View style={styles.categoryIconContainer}>
        <Ionicons name={icon as any} size={24} color={colors.blue} />
      </View>
      <Text style={styles.categoryTitle}>{titulo}</Text>
    </View>
    <View style={styles.itemsGrid}>
      {itens.map((item) => (
        <CheckboxItem
          key={item.id}
          item={item}
          checked={checkedItems.includes(item.id)}
          onChange={onChange}
        />
      ))}
    </View>
  </View>
);

const Etapa6 = () => {
  const navigation = useNavigation<NavigationProps>();
  const { formData, updateFormData } = useSpaceRegister();
  const [selectedItems, setSelectedItems] = useState<string[]>(formData.space_amenities || []);

  const handleItemChange = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    }
  };

  const handleProsseguir = () => {
    if (selectedItems.length === 0) {
      Alert.alert('Erro', 'Selecione pelo menos uma comodidade para o espaço.');
      return;
    }

    updateFormData({
      ...formData,
      space_amenities: selectedItems,
    });
    navigation.navigate('Etapa7' as never);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.progressContainer}>
          <ProgressBar progress={0.75} currentStep={6} totalSteps={8} />
        </View>

        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Comodidades do Espaço</Text>
          <Text style={styles.subtitle}>
            Selecione as comodidades disponíveis no seu espaço
          </Text>

          {CATEGORIAS.map((categoria) => (
            <Categoria
              key={categoria.titulo}
              titulo={categoria.titulo}
              icon={categoria.icon}
              itens={categoria.itens}
              checkedItems={selectedItems}
              onChange={handleItemChange}
            />
          ))}
        </ScrollView>

        <NavigationButtons
          onBack={() => navigation.goBack()}
          onNext={handleProsseguir}
          disabled={selectedItems.length === 0}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Etapa6; 