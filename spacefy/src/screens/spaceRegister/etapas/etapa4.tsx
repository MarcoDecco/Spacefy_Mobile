import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, SafeAreaView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../../navigation/types';
import RegisterSpaceButton from '../../../components/buttons/registerSpaceButton';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../../styles/spaceRegisterStyles/etapa4Styles';
import { colors } from '../../../styles/globalStyles/colors';
import { ProgressBar } from '../../../components/ProgressBar';
import { useSpaceRegister } from '../../../contexts/SpaceRegisterContext';

// Função para formatar moeda
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Array com os dias da semana
const DIAS_SEMANA = [
    { id: 'domingo', label: 'Domingo', order: 0 },
    { id: 'segunda', label: 'Segunda-feira', order: 1 },
    { id: 'terca', label: 'Terça-feira', order: 2 },
    { id: 'quarta', label: 'Quarta-feira', order: 3 },
    { id: 'quinta', label: 'Quinta-feira', order: 4 },
    { id: 'sexta', label: 'Sexta-feira', order: 5 },
    { id: 'sabado', label: 'Sábado', order: 6 }
];

interface CampoHorarioProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

// Componente para campo de horário
const CampoHorario: React.FC<CampoHorarioProps> = ({ label, value, onChange }) => {
    const handleTimeChange = (text: string) => {
        // Remove caracteres não numéricos
        const numbers = text.replace(/[^\d]/g, '');
        
        // Formata o horário como HH:mm
        let formatted = numbers;
        if (numbers.length > 2) {
            formatted = numbers.slice(0, 2) + ':' + numbers.slice(2, 4);
        }
        
        // Valida o horário
        if (formatted.length === 5) {
            const [hours, minutes] = formatted.split(':').map(Number);
            if (hours > 23 || minutes > 59) {
                return;
            }
        }
        
        onChange(formatted);
    };

    return (
        <View style={styles.horarioContainer}>
            <Text style={styles.horarioLabel}>{label}</Text>
            <View style={styles.pickerContainer}>
                <TextInput
                    style={styles.picker}
                    value={value}
                    onChangeText={handleTimeChange}
                    placeholder="00:00"
                    keyboardType="numeric"
                    maxLength={5}
                />
            </View>
        </View>
    );
};

interface CampoPrecoProps {
    value: string;
    onChange: (value: string) => void;
}

// Componente para campo de preço
const CampoPreco: React.FC<CampoPrecoProps> = ({ value, onChange }) => {
    const formatarPreco = (valor: number): string => {
        if (!valor) return 'R$ 0,00';
        return formatCurrency(valor);
    };

    const calcularValorLiquido = (valor: number): number => {
        if (!valor) return 0;
        return valor * 0.90; // 90% do valor total (100% - 10% de comissão)
    };

    const handlePrecoChange = (text: string) => {
        const valor = text.replace(/[^\d]/g, '');
        const valorNumerico = valor ? parseFloat(valor) / 100 : 0;
        onChange(valorNumerico.toString());
    };

    return (
        <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Valor por Hora</Text>
            <TextInput
                style={styles.priceInput}
                value={formatarPreco(Number(value))}
                onChangeText={handlePrecoChange}
                placeholder="Digite o valor por hora"
                keyboardType="numeric"
            />
            <Text style={styles.precoInfo}>
                Após a comissão do site (10%), você receberá: {' '}
                <Text style={styles.precoLiquido}>
                    {formatarPreco(calcularValorLiquido(Number(value)))}
                </Text> por hora
            </Text>
        </View>
    );
};

interface CheckboxDiaProps {
    dia: {
        id: string;
        label: string;
        order: number;
    };
    checked: boolean;
    onChange: (id: string, checked: boolean) => void;
}

// Componente para checkbox de dia da semana
const CheckboxDia: React.FC<CheckboxDiaProps> = ({ dia, checked, onChange }) => (
    <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => onChange(dia.id, !checked)}
    >
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
            {checked && <Ionicons name="checkmark" size={16} color="#fff" />}
        </View>
        <Text style={styles.checkboxLabel}>{dia.label}</Text>
    </TouchableOpacity>
);

interface HorariosDiaProps {
    dia: {
        id: string;
        label: string;
        order: number;
    };
    timeRanges: Array<{
        open: string;
        close: string;
    }>;
    onAddTimeRange: (dayId: string) => void;
    onRemoveTimeRange: (dayId: string, index: number) => void;
    onUpdateTimeRange: (dayId: string, index: number, field: string, value: string) => void;
}

// Componente para horários de um dia específico
const HorariosDia: React.FC<HorariosDiaProps> = ({ dia, timeRanges, onAddTimeRange, onRemoveTimeRange, onUpdateTimeRange }) => {
    const handleTimeUpdate = (index: number, field: string, value: string) => {
        const currentRange = timeRanges[index];
        const newRange = { ...currentRange, [field]: value };

        if (newRange.open && newRange.close) {
            const openTime = new Date(`2000-01-01T${newRange.open}`);
            const closeTime = new Date(`2000-01-01T${newRange.close}`);
            
            if (closeTime <= openTime) {
                Alert.alert('Erro', 'O horário de fechamento deve ser posterior ao de abertura');
                return;
            }
        }

        onUpdateTimeRange(dia.id, index, field, value);
    };

    return (
        <View style={styles.horariosDiaContainer}>
            <Text style={styles.horariosDiaTitle}>{dia.label}</Text>
            {timeRanges.map((range, index) => (
                <View key={index} style={styles.horarioRangeContainer}>
                    <View style={styles.horarioFieldsContainer}>
                        <CampoHorario
                            label="Abertura"
                            value={range.open}
                            onChange={(value) => handleTimeUpdate(index, 'open', value)}
                        />
                        <CampoHorario
                            label="Fechamento"
                            value={range.close}
                            onChange={(value) => handleTimeUpdate(index, 'close', value)}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => onRemoveTimeRange(dia.id, index)}
                    >
                        <Ionicons name="trash-outline" size={24} color={colors.error} />
                    </TouchableOpacity>
                </View>
            ))}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => onAddTimeRange(dia.id)}
            >
                <Ionicons name="add-circle-outline" size={20} color={colors.blue} />
                <Text style={styles.addButtonText}>Adicionar Horário</Text>
            </TouchableOpacity>
        </View>
    );
};

const Etapa4 = () => {
    const navigation = useNavigation<NavigationProps>();
    const { formData, updateFormData } = useSpaceRegister();
    const [weekly_days, setWeeklyDays] = useState<string[]>(formData.weekly_days?.map(day => day.day) || []);
    const [price_per_hour, setPricePerHour] = useState<string>(formData.price_per_hour || '');
    const [timeRanges, setTimeRanges] = useState<Record<string, Array<{ open: string; close: string }>>>({});

    const handleDayToggle = (day: string) => {
        setWeeklyDays(prev => {
            if (prev.includes(day)) {
                const newSelectedDays = prev.filter(d => d !== day);
                // Remover os horários do dia que foi desmarcado
                setTimeRanges(prev => {
                    const newRanges = { ...prev };
                    delete newRanges[day];
                    return newRanges;
                });
                return newSelectedDays;
            } else {
                return [...prev, day];
            }
        });
    };

    const handleAddTimeRange = (dayId: string) => {
        setTimeRanges(prev => ({
            ...prev,
            [dayId]: [...(prev[dayId] || []), { open: '', close: '' }]
        }));
    };

    const handleRemoveTimeRange = (dayId: string, index: number) => {
        setTimeRanges(prev => ({
            ...prev,
            [dayId]: prev[dayId].filter((_, i) => i !== index)
        }));
    };

    const handleUpdateTimeRange = (dayId: string, index: number, field: string, value: string) => {
        setTimeRanges(prev => ({
            ...prev,
            [dayId]: prev[dayId].map((range, i) => 
                i === index ? { ...range, [field]: value } : range
            )
        }));
    };

    const handleReplicateTimeRanges = () => {
        if (weekly_days.length < 2) return;

        // Pegar os horários do primeiro dia selecionado
        const firstDay = weekly_days[0];
        const firstDayRanges = timeRanges[firstDay] || [];

        // Replicar para todos os outros dias
        const newTimeRanges = { ...timeRanges };
        weekly_days.slice(1).forEach(dayId => {
            newTimeRanges[dayId] = [...firstDayRanges];
        });

        setTimeRanges(newTimeRanges);
    };

    // Função para validar os campos da etapa
    const validarEtapa = () => {
        const erros = [];
        
        if (Number(price_per_hour) <= 0) {
            erros.push('O valor por hora deve ser maior que zero');
        }

        if (weekly_days.length === 0) {
            erros.push('Selecione pelo menos um dia da semana');
        }

        // Validar horários para cada dia selecionado
        weekly_days.forEach((dayId) => {
            const dayRanges = timeRanges[dayId] || [];
            if (dayRanges.length === 0) {
                erros.push(`Adicione pelo menos um horário para ${DIAS_SEMANA.find(d => d.id === dayId)?.label}`);
            } else {
                dayRanges.forEach((range: { open: string; close: string }, index) => {
                    if (!range.open || !range.close) {
                        erros.push(`Preencha os horários de abertura e fechamento para ${DIAS_SEMANA.find(d => d.id === dayId)?.label} (horário ${index + 1})`);
                    }
                });
            }
        });

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

        // Formatar os dados para o formato esperado pela API
        const formattedWeeklyDays = weekly_days.map(dayId => ({
            day: dayId,
            time_ranges: timeRanges[dayId] || []
        }));

        updateFormData({
            weekly_days: formattedWeeklyDays,
            price_per_hour,
        });
        navigation.navigate('Etapa5' as never);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <View style={styles.progressContainer}>
                    <ProgressBar progress={0.5} currentStep={4} totalSteps={8} />
                </View>
                <Text style={styles.title}>Disponibilidade e Preços</Text>
                <Text style={styles.subtitle}>
                    Defina os horários de funcionamento e o valor por hora do seu espaço
                </Text>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Valor por Hora</Text>
                        <CampoPreco value={price_per_hour} onChange={setPricePerHour} />
                    </View>

                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Dias de Funcionamento</Text>
                        <View style={styles.daysContainer}>
                            <View style={styles.checkboxGrid}>
                                {DIAS_SEMANA.map(dia => (
                                    <CheckboxDia
                                        key={dia.id}
                                        dia={dia}
                                        checked={weekly_days.includes(dia.id)}
                                        onChange={handleDayToggle}
                                    />
                                ))}
                            </View>
                        </View>
                    </View>

                    {weekly_days.length > 0 && (
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Horários de Funcionamento</Text>
                            {weekly_days.map(dayId => {
                                const dia = DIAS_SEMANA.find(d => d.id === dayId);
                                if (!dia) return null;
                                return (
                                    <HorariosDia
                                        key={dayId}
                                        dia={dia}
                                        timeRanges={timeRanges[dayId] || []}
                                        onAddTimeRange={handleAddTimeRange}
                                        onRemoveTimeRange={handleRemoveTimeRange}
                                        onUpdateTimeRange={handleUpdateTimeRange}
                                    />
                                );
                            })}
                            {weekly_days.length > 1 && (
                                <TouchableOpacity
                                    style={styles.replicateButton}
                                    onPress={handleReplicateTimeRanges}
                                >
                                    <Text style={styles.replicateButtonText}>
                                        Replicar horários para todos os dias selecionados
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
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

export default Etapa4; 