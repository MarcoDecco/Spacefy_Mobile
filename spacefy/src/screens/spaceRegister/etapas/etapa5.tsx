import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../../navigation/types';
import RegisterSpaceButton from '../../../components/buttons/registerSpaceButton';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../../styles/spaceRegisterStyles/etapa5Styles';
import { colors } from '../../../styles/globalStyles/colors';
import { ProgressBar } from '../../../components/ProgressBar';
import { useSpaceRegister } from '../../../contexts/SpaceRegisterContext';

// Array com as regras disponíveis para o espaço
const REGRAS = [
    {
        id: 'nao_fumar',
        label: 'Não é permitido fumar',
        descricao: 'O uso de tabaco não é permitido no espaço'
    },
    {
        id: 'nao_animais',
        label: 'Não é permitido animais',
        descricao: 'Animais de estimação não são permitidos no espaço'
    },
    {
        id: 'nao_festas',
        label: 'Não é permitido festas',
        descricao: 'Eventos e festas não são permitidos no espaço'
    },
    {
        id: 'nao_barulho',
        label: 'Não é permitido barulho após 22h',
        descricao: 'O espaço deve manter silêncio após as 22h'
    },
    {
        id: 'reserva_antecipada',
        label: 'É necessário reserva antecipada',
        descricao: 'As reservas devem ser feitas com antecedência'
    },
    {
        id: 'deposito',
        label: 'É necessário depósito de segurança',
        descricao: 'Um depósito será cobrado para garantir a segurança do espaço'
    },
    {
        id: 'contrato',
        label: 'É necessário contrato',
        descricao: 'Um contrato será necessário para a utilização do espaço'
    },
    {
        id: 'seguro',
        label: 'É necessário seguro',
        descricao: 'Um seguro será necessário para a utilização do espaço'
    }
];

interface CheckboxRegraProps {
    regra: {
        id: string;
        label: string;
        descricao: string;
    };
    checked: boolean;
    onChange: (id: string, checked: boolean) => void;
}

// Componente para checkbox de regra
const CheckboxRegra: React.FC<CheckboxRegraProps> = ({ regra, checked, onChange }) => (
    <TouchableOpacity
        style={styles.ruleItem}
        onPress={() => onChange(regra.id, !checked)}
    >
        <View style={[styles.checkboxContainer, checked && styles.checkboxChecked]}>
            {checked && <Ionicons name="checkmark" size={16} color="#fff" />}
        </View>
        <View style={styles.ruleContent}>
            <Text style={styles.ruleLabel}>{regra.label}</Text>
            <Text style={styles.ruleDescription}>{regra.descricao}</Text>
        </View>
    </TouchableOpacity>
);

const Etapa5 = () => {
    const navigation = useNavigation<NavigationProps>();
    const { formData, updateFormData } = useSpaceRegister();
    const [selectedRules, setSelectedRules] = useState<string[]>(formData.space_rules || []);

    const handleRuleChange = (ruleId: string, checked: boolean) => {
        if (checked) {
            setSelectedRules([...selectedRules, ruleId]);
        } else {
            setSelectedRules(selectedRules.filter(id => id !== ruleId));
        }
    };

    // Função para validar os campos da etapa
    const validarEtapa = () => {
        const erros = [];
        
        if (selectedRules.length === 0) {
            erros.push('Selecione pelo menos uma regra para o espaço');
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
            space_rules: selectedRules,
        });
        navigation.navigate('Etapa6' as never);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <View style={styles.progressContainer}>
                    <ProgressBar progress={0.625} currentStep={5} totalSteps={8} />
                </View>
                <Text style={styles.title}>Regras do Espaço</Text>
                <Text style={styles.subtitle}>
                    Selecione as regras que se aplicam ao seu espaço
                </Text>

                <ScrollView showsVerticalScrollIndicator={false}>
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

export default Etapa5; 