import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard, Alert, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../../styles/spaceRegisterStyles/etapa5Styles';
import { colors } from '../../../styles/globalStyles/colors';
import { ProgressBar } from '../../../components/ProgressBar';
import { useSpaceRegister } from '../../../contexts/SpaceRegisterContext';
import { NavigationButtons } from '../../../components/buttons/NavigationButtons';
import { useTheme } from '../../../contexts/ThemeContext';

// Array com as regras disponíveis para o espaço
const REGRAS = [
    {
        id: 'nao_fumar',
        label: 'Não é permitido fumar',
        descricao: 'O uso de tabaco não é permitido no espaço',
        icon: 'close-circle',
    },
    {
        id: 'nao_animais',
        label: 'Não é permitido animais',
        descricao: 'Animais de estimação não são permitidos no espaço',
        icon: 'paw',
    },
    {
        id: 'nao_festas',
        label: 'Não é permitido festas',
        descricao: 'Eventos e festas não são permitidos no espaço',
        icon: 'wine',
    },
    {
        id: 'nao_barulho',
        label: 'Não é permitido barulho após 22h',
        descricao: 'O espaço deve manter silêncio após as 22h',
        icon: 'volume-low',
    },
    {
        id: 'reserva_antecipada',
        label: 'É necessário reserva antecipada',
        descricao: 'As reservas devem ser feitas com antecedência',
        icon: 'calendar',
    },
    {
        id: 'deposito',
        label: 'É necessário depósito de segurança',
        descricao: 'Um depósito será cobrado para garantir a segurança do espaço',
        icon: 'shield-checkmark',
    },
    {
        id: 'contrato',
        label: 'É necessário contrato',
        descricao: 'Um contrato será necessário para a utilização do espaço',
        icon: 'document-text',
    },
    {
        id: 'seguro',
        label: 'É necessário seguro',
        descricao: 'Um seguro será necessário para a utilização do espaço',
        icon: 'shield',
    },
];

interface CheckboxRegraProps {
    regra: {
        id: string;
        label: string;
        descricao: string;
        icon: string;
    };
    checked: boolean;
    onChange: (id: string, checked: boolean) => void;
}

// Componente para checkbox de regra
const CheckboxRegra: React.FC<CheckboxRegraProps> = ({ regra, checked, onChange }) => {
    const { theme } = useTheme();
    
    return (
        <TouchableOpacity
            style={[
                styles.ruleItem,
                { backgroundColor: theme.card, borderColor: theme.border },
                checked && styles.ruleItemSelected
            ]}
            onPress={() => onChange(regra.id, !checked)}
        >
            <View style={[styles.ruleIconContainer, { backgroundColor: theme.background }]}>
                <Ionicons
                    name={regra.icon as any}
                    size={24}
                    color={checked ? colors.blue : theme.text}
                />
            </View>
            <View style={styles.ruleContent}>
                <Text style={[styles.ruleLabel, { color: theme.text }, checked && styles.ruleLabelSelected]}>
                    {regra.label}
                </Text>
                <Text style={[styles.ruleDescription, { color: theme.text }, checked && styles.ruleDescriptionSelected]}>
                    {regra.descricao}
                </Text>
            </View>
            <View style={[styles.checkboxContainer, { borderColor: theme.border }, checked && styles.checkboxChecked]}>
                {checked && <Ionicons name="checkmark" size={16} color={colors.white} />}
            </View>
        </TouchableOpacity>
    );
};

const Etapa5 = () => {
    const navigation = useNavigation<NavigationProps>();
    const { formData, updateFormData } = useSpaceRegister();
    const [selectedRules, setSelectedRules] = useState<string[]>(formData.space_rules || []);
    const { theme, isDarkMode } = useTheme();

    const handleRuleChange = (ruleId: string, checked: boolean) => {
        if (checked) {
            setSelectedRules([...selectedRules, ruleId]);
        } else {
            setSelectedRules(selectedRules.filter(id => id !== ruleId));
        }
    };

    const handleProsseguir = () => {
        if (selectedRules.length === 0) {
            Alert.alert('Erro', 'Selecione pelo menos uma regra para o espaço.');
            return;
        }

        updateFormData({
            ...formData,
            space_rules: selectedRules,
        });
        navigation.navigate('Etapa6' as never);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <StatusBar 
                    barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                />
                
                <View style={[styles.progressContainer, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
                    <ProgressBar progress={0.625} currentStep={5} totalSteps={8} />
                </View>

                <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
                    <Text style={[styles.title, { color: theme.text }]}>Regras do Espaço</Text>
                    <Text style={[styles.subtitle, { color: theme.text }]}>
                        Selecione as regras que se aplicam ao seu espaço
                    </Text>

                    <View style={styles.rulesContainer}>
                        {REGRAS.map((regra) => (
                            <CheckboxRegra
                                key={regra.id}
                                regra={regra}
                                checked={selectedRules.includes(regra.id)}
                                onChange={handleRuleChange}
                            />
                        ))}
                    </View>
                </ScrollView>

                <NavigationButtons
                    onBack={() => navigation.goBack()}
                    onNext={handleProsseguir}
                    disabled={selectedRules.length === 0}
                />
            </View>
        </TouchableWithoutFeedback>
    );
};

export default Etapa5; 