import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../../navigation/types';
import RegisterSpaceButton from '../../../components/buttons/registerSpaceButton';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../../styles/spaceRegisterStyles/etapa6Styles';
import { colors } from '../../../styles/globalStyles/colors';
import { ProgressBar } from '../../../components/ProgressBar';
import { useSpaceRegister } from '../../../contexts/SpaceRegisterContext';

// Array com todas as categorias e seus itens
const CATEGORIAS = [
    {
        titulo: 'Acessibilidade',
        itens: [
            { id: 'estacionamento', label: 'Estacionamento' },
            { id: 'bicicletario', label: 'Bicicletário' },
            { id: 'ponto_transporte', label: 'Ponto de Transporte' },
            { id: 'acesso_pcd', label: 'Acesso para PCD' },
            { id: 'elevador', label: 'Elevador' },
            { id: 'rampa_acesso', label: 'Rampa de Acesso' },
            { id: 'banheiro_pcd', label: 'Banheiro Adaptado' },
        ],
    },
    {
        titulo: 'Segurança',
        itens: [
            { id: 'cameras', label: 'Cameras de segurança' },
            { id: 'alarme', label: 'Sistema de alarme' },
            { id: 'combate_incendio', label: 'Sistema de combate a incêndios' },
            { id: 'iluminacao_emergencia', label: 'Iluminação de emergência' },
            { id: 'guarita', label: 'Guarita de Segurança' },
            { id: 'controle_acesso', label: 'Controle de Acesso' },
            { id: 'monitoramento_24h', label: 'Monitoramento 24h' },
        ],
    },
    {
        titulo: 'Conforto e Infraestrutura',
        itens: [
            { id: 'ar_condicionado', label: 'Ar-condicionado' },
            { id: 'cadeiras', label: 'Cadeiras' },
            { id: 'mesas', label: 'Mesas' },
            { id: 'palco', label: 'Palco/Espaço Elevado' },
            { id: 'som', label: 'Sistema de som' },
            { id: 'microfones', label: 'Microfones' },
            { id: 'banheiros', label: 'Banheiros' },
            { id: 'vestiarios', label: 'Vestiários' },
            { id: 'chuveiros', label: 'Chuveiros' },
            { id: 'armarios', label: 'Armários' },
            { id: 'espelho', label: 'Espelhos' },
            { id: 'ventiladores', label: 'Ventiladores' },
            { id: 'aquecimento', label: 'Sistema de Aquecimento' },
            { id: 'acustica', label: 'Tratamento Acústico' },
            { id: 'iluminacao_cenica', label: 'Iluminação Cênica' },
        ],
    },
    {
        titulo: 'Alimentação e Conveniência',
        itens: [
            { id: 'cafeteira', label: 'Máquina de Café' },
            { id: 'bebedouro', label: 'Bebedouro' },
            { id: 'cozinha', label: 'Cozinha' },
            { id: 'loucas', label: 'Louças' },
            { id: 'talheres', label: 'Talheres' },
            { id: 'fogao', label: 'Fogão' },
            { id: 'forno', label: 'Forno' },
            { id: 'microondas', label: 'Micro-ondas' },
            { id: 'churrasqueira', label: 'Churrasqueira' },
            { id: 'geladeira', label: 'Geladeira' },
            { id: 'freezer', label: 'Freezer' },
            { id: 'pia', label: 'Pia' },
            { id: 'mesa_bar', label: 'Mesa de Bar' },
            { id: 'buffet', label: 'Área de Buffet' },
        ],
    },
    {
        titulo: 'Equipamentos e Tecnologia',
        itens: [
            { id: 'wifi', label: 'Wi-Fi' },
            { id: 'projetor', label: 'Projetor' },
            { id: 'tela_projecao', label: 'Tela de Projeção' },
            { id: 'som_tecnologia', label: 'Sistema de Som' },
            { id: 'microfones_tecnologia', label: 'Microfones' },
            { id: 'equipamentos_auxiliares', label: 'Equipamentos Auxiliares' },
            { id: 'computador', label: 'Computador' },
            { id: 'tv', label: 'TV' },
            { id: 'video_conferencia', label: 'Videoconferência' },
            { id: 'impressora', label: 'Impressora' },
            { id: 'scanner', label: 'Scanner' },
            { id: 'tomadas_220v', label: 'Tomadas 220V' },
            { id: 'gerador', label: 'Gerador' },
        ],
    },
    {
        titulo: 'Áreas Externas',
        itens: [
            { id: 'jardim', label: 'Jardim' },
            { id: 'deck', label: 'Deck' },
            { id: 'piscina', label: 'Piscina' },
            { id: 'quadra', label: 'Quadra' },
            { id: 'playground', label: 'Playground' },
            { id: 'varanda', label: 'Varanda' },
            { id: 'terraco', label: 'Terraço' },
            { id: 'estacionamento_coberto', label: 'Estacionamento Coberto' }
        ],
    },
];

interface CheckboxItemProps {
    item: {
        id: string;
        label: string;
    };
    checked: boolean;
    onChange: (id: string, checked: boolean) => void;
}

// Componente para checkbox de item individual
const CheckboxItem: React.FC<CheckboxItemProps> = ({ item, checked, onChange }) => (
    <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => onChange(item.id, !checked)}
    >
        <View style={styles.checkboxContainer}>
            <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                {checked && <Ionicons name="checkmark" size={16} color="#fff" />}
            </View>
            <Text style={styles.itemLabel}>{item.label}</Text>
        </View>
    </TouchableOpacity>
);

interface CategoriaProps {
    titulo: string;
    itens: Array<{
        id: string;
        label: string;
    }>;
    checkedItems: string[];
    onChange: (id: string, checked: boolean) => void;
}

// Componente para renderizar uma categoria e seus itens
const Categoria: React.FC<CategoriaProps> = ({ titulo, itens, checkedItems, onChange }) => (
    <View style={styles.categorySection}>
        <Text style={styles.categoryTitle}>{titulo}</Text>
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

    // Função para validar os campos da etapa
    const validarEtapa = () => {
        const erros = [];
        
        if (selectedItems.length === 0) {
            erros.push('Selecione pelo menos uma comodidade para o espaço');
        }

        return {
            valido: erros.length === 0,
            erros
        };
    };

    const handleProsseguir = () => {
        const validacao = validarEtapa();
        
        if (!validacao.valido) {
            Alert.alert(
                'Campos Obrigatórios',
                validacao.erros.join('\n'),
                [{ text: 'OK' }]
            );
            return;
        }

        updateFormData({
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
                <Text style={styles.title}>Comodidades</Text>
                <Text style={styles.subtitle}>
                    Selecione as comodidades disponíveis no seu espaço
                </Text>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.categoriesContainer}>
                        {CATEGORIAS.map((categoria) => (
                            <Categoria
                                key={categoria.titulo}
                                titulo={categoria.titulo}
                                itens={categoria.itens}
                                checkedItems={selectedItems}
                                onChange={handleItemChange}
                            />
                        ))}
                    </View>
                </ScrollView>

                <View style={styles.buttonRowFixed}>
                    <RegisterSpaceButton
                        title="Voltar"
                        onPress={() => navigation.goBack()}
                        variant="secondary"
                    />
                    <RegisterSpaceButton
                        title="Continuar"
                        onPress={handleProsseguir}
                        variant="primary"
                    />
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

export default Etapa6; 