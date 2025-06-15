import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../../navigation/types';
import RegisterSpaceButton from '../../../components/buttons/registerSpaceButton';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../../styles/spaceRegisterStyles/etapa4Styles';
import { colors } from '../../../styles/globalStyles/colors';

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

// Gerar opções de horário
const gerarOpcoesHorario = () => {
    const opcoes = [];
    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 30) {
            const hora = h.toString().padStart(2, '0');
            const minuto = m.toString().padStart(2, '0');
            opcoes.push(`${hora}:${minuto}`);
        }
    }
    return opcoes;
};

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
    value: number;
    onChange: (value: number) => void;
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
        onChange(valorNumerico);
    };

    return (
        <View style={styles.priceContainer}>
            <TextInput
                style={styles.priceInput}
                value={formatarPreco(value)}
                onChangeText={handlePrecoChange}
                placeholder="Digite o valor por hora"
                keyboardType="numeric"
            />
            <Text style={styles.precoInfo}>
                Após a comissão do site (10%), você receberá: {' '}
                <Text style={styles.precoLiquido}>
                    {formatarPreco(calcularValorLiquido(value))}
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
                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    </TouchableOpacity>
                </View>
            ))}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => onAddTimeRange(dia.id)}
            >
                <Ionicons name="add-circle-outline" size={20} color="#3B82F6" />
                <Text style={styles.addButtonText}>Adicionar Horário</Text>
            </TouchableOpacity>
        </View>
    );
};

// Componente principal da Etapa 4
const Etapa4: React.FC = () => {
    const navigation = useNavigation<NavigationProps>();
    const [selectedDays, setSelectedDays] = useState<Array<{day: string, time_ranges: Array<{open: string, close: string}>}>>([]);
    const [price, setPrice] = useState(0);

    const sortedSelectedDays = useMemo(() => {
        return [...selectedDays].sort((a, b) => {
            const dayA = DIAS_SEMANA.find(dia => dia.id === a.day);
            const dayB = DIAS_SEMANA.find(dia => dia.id === b.day);
            if (!dayA || !dayB) return 0;
            return dayA.order - dayB.order;
        });
    }, [selectedDays]);

    const handleDayChange = (dayId: string, checked: boolean) => {
        const updatedDays = [...selectedDays];
        const dayIndex = updatedDays.findIndex(d => d.day === dayId);

        if (checked && dayIndex === -1) {
            updatedDays.push({
                day: dayId,
                time_ranges: []
            });
        } else if (!checked && dayIndex !== -1) {
            updatedDays.splice(dayIndex, 1);
        }

        setSelectedDays(updatedDays);
    };

    const handleAddTimeRange = (dayId: string) => {
        const updatedDays = selectedDays.map(day => {
            if (day.day === dayId) {
                const hasEmptyTimeRange = day.time_ranges.some(
                    range => !range.open || !range.close
                );
                
                if (hasEmptyTimeRange) {
                    Alert.alert('Atenção', 'Por favor, complete o horário atual antes de adicionar um novo');
                    return day;
                }

                return {
                    ...day,
                    time_ranges: [...day.time_ranges, { open: '', close: '' }]
                };
            }
            return day;
        });

        setSelectedDays(updatedDays);
    };

    const handleRemoveTimeRange = (dayId: string, index: number) => {
        const updatedDays = selectedDays.map(day => {
            if (day.day === dayId) {
                return {
                    ...day,
                    time_ranges: day.time_ranges.filter((_, i) => i !== index)
                };
            }
            return day;
        });

        setSelectedDays(updatedDays);
    };

    const handleUpdateTimeRange = (dayId: string, index: number, field: string, value: string) => {
        const updatedDays = selectedDays.map(day => {
            if (day.day === dayId) {
                const updatedRanges = [...day.time_ranges];
                updatedRanges[index] = {
                    ...updatedRanges[index],
                    [field]: value
                };
                return {
                    ...day,
                    time_ranges: updatedRanges
                };
            }
            return day;
        });

        setSelectedDays(updatedDays);
    };

    const handleReplicateTimeRanges = () => {
        if (selectedDays.length < 2) {
            Alert.alert('Erro', 'Selecione pelo menos dois dias para replicar os horários');
            return;
        }

        const firstSelectedDay = sortedSelectedDays[0];
        
        if (!firstSelectedDay.time_ranges || firstSelectedDay.time_ranges.length === 0) {
            Alert.alert('Erro', 'O primeiro dia selecionado precisa ter horários definidos');
            return;
        }

        const updatedDays = selectedDays.map(day => {
            if (day.day === firstSelectedDay.day) return day;
            return {
                ...day,
                time_ranges: JSON.parse(JSON.stringify(firstSelectedDay.time_ranges))
            };
        });

        setSelectedDays(updatedDays);
        Alert.alert('Sucesso', 'Horários replicados com sucesso!');
    };

    const handleNext = () => {
        // Validar se pelo menos um dia foi selecionado
        if (selectedDays.length === 0) {
            Alert.alert('Erro', 'Selecione pelo menos um dia da semana');
            return;
        }

        // Validar se todos os dias selecionados têm horários definidos
        const hasEmptyTimeRanges = selectedDays.some(day => 
            day.time_ranges.length === 0 || 
            day.time_ranges.some(range => !range.open || !range.close)
        );

        if (hasEmptyTimeRanges) {
            Alert.alert('Erro', 'Todos os dias selecionados devem ter horários completos');
            return;
        }

        // Validar se o preço foi definido
        if (!price || price <= 0) {
            Alert.alert('Erro', 'Defina um preço válido por hora');
            return;
        }

        // Navegar para a próxima etapa
        navigation.navigate('SpaceNextStepScreen');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.progressContainer}>
                <Text style={styles.progressText}>Etapa 4 de 8</Text>
                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: '16%' }]} />
                    <View style={[styles.progressBar, { width: '16%' }]} />
                    <View style={[styles.progressBar, { width: '16%' }]} />
                    <View style={[styles.progressBar, { width: '16%' }]} />
                    <View style={styles.progressBarInactive} />
                    <View style={styles.progressBarInactive} />
                    <View style={styles.progressBarInactive} />
                    <View style={styles.progressBarInactive} />
                </View>
            </View>

            <ScrollView style={{ flex: 1, padding: 16 }}>
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Preço por hora</Text>
                    <Text style={styles.subtitle}>Defina o valor da hora do seu espaço</Text>
                    <CampoPreco value={price} onChange={setPrice} />
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Dias disponíveis</Text>
                    <Text style={styles.subtitle}>Selecione os dias em que seu espaço estará disponível</Text>
                    <View style={styles.daysContainer}>
                        {DIAS_SEMANA.map((dia) => (
                            <CheckboxDia
                                key={dia.id}
                                dia={dia}
                                checked={selectedDays.some((d) => d.day === dia.id)}
                                onChange={handleDayChange}
                            />
                        ))}
                    </View>
                </View>

                {sortedSelectedDays.map((dia) => {
                    const diaInfo = DIAS_SEMANA.find((d) => d.id === dia.day);
                    if (!diaInfo) return null;
                    return (
                        <HorariosDia
                            key={dia.day}
                            dia={diaInfo}
                            timeRanges={dia.time_ranges}
                            onAddTimeRange={handleAddTimeRange}
                            onRemoveTimeRange={handleRemoveTimeRange}
                            onUpdateTimeRange={handleUpdateTimeRange}
                        />
                    );
                })}

                {selectedDays.length > 0 && (
                    <TouchableOpacity
                        style={styles.replicateButton}
                        onPress={handleReplicateTimeRanges}
                    >
                        <Text style={styles.replicateButtonText}>Replicar horários para outros dias</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>

            <View style={styles.buttonRowFixed}>
                <RegisterSpaceButton
                    title="Voltar"
                    onPress={() => navigation.goBack()}
                    variant="secondary"
                />
                <RegisterSpaceButton
                    title="Prosseguir"
                    onPress={handleNext}
                />
            </View>
        </SafeAreaView>
    );
};

const localStyles = StyleSheet.create({
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: colors.black,
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 16,
        color: colors.gray,
        marginBottom: 16,
    },
    priceContainer: {
        marginBottom: 16,
    },
    priceInput: {
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: colors.white,
    },
    precoInfo: {
        marginTop: 8,
        fontSize: 14,
        color: colors.gray,
    },
    precoLiquido: {
        color: colors.green,
        fontWeight: '600',
    },
    daysContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        width: '48%',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: colors.blue,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: colors.blue,
    },
    checkboxLabel: {
        fontSize: 16,
        color: colors.black,
    },
    replicateButton: {
        backgroundColor: colors.blue,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 24,
    },
    replicateButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    horariosDiaContainer: {
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.gray,
    },
    horariosDiaTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.black,
        marginBottom: 16,
    },
    horarioRangeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    horarioFieldsContainer: {
        flex: 1,
        flexDirection: 'row',
        gap: 12,
    },
    horarioContainer: {
        flex: 1,
    },
    horarioLabel: {
        fontSize: 14,
        color: colors.gray,
        marginBottom: 4,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 8,
        backgroundColor: colors.white,
    },
    picker: {
        height: 50,
    },
    removeButton: {
        padding: 8,
        marginLeft: 8,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: colors.blue,
        borderRadius: 8,
        marginTop: 8,
    },
    addButtonText: {
        color: colors.blue,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default Etapa4; 