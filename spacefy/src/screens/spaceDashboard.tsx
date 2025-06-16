import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { spaceService } from '../services/spaceService';
import { useAuth } from '../contexts/AuthContext';
import { blockedDatesService } from '../services/blockedDates';

interface Espaco {
    _id: string;
    space_name: string;
    max_people: number;
    price_per_hour: number;
    location?: { formatted_address?: string };
    space_description?: string;
    status?: 'Disponível' | 'Ocupado';
}

interface RentedTime {
    startTime: string;
    endTime: string;
}

interface RentedDate {
    date: string;
    times: RentedTime[];
}

interface BlockedDatesResponse {
    blocked_dates: string[];
    rented_dates: RentedDate[];
}

export default function SpaceDashboard() {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [espacos, setEspacos] = useState<Espaco[]>([]);
    const [espacoSelecionado, setEspacoSelecionado] = useState<Espaco | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [datasAlugadas, setDatasAlugadas] = useState<RentedDate[]>([]);
    const [loadingDatasAlugadas, setLoadingDatasAlugadas] = useState(false);

    const buscarDatasAlugadas = useCallback(async (spaceId: string) => {
        setLoadingDatasAlugadas(true);
        try {
            const data: BlockedDatesResponse = await blockedDatesService.getBlockedDatesBySpaceId(spaceId);
            setDatasAlugadas(data.rented_dates || []);
        } catch (error) {
            setDatasAlugadas([]);
        } finally {
            setLoadingDatasAlugadas(false);
        }
    }, []);

    useEffect(() => {
        if (espacoSelecionado?._id) {
            buscarDatasAlugadas(espacoSelecionado._id);
        } else {
            setDatasAlugadas([]);
        }
    }, [espacoSelecionado, buscarDatasAlugadas]);

    useEffect(() => {
        const carregarEspacos = async () => {
            try {
                setIsLoading(true);
                if (user?.id) {
                    const espacosDoUsuario = await spaceService.getSpacesByOwnerId(user.id);
                    setEspacos(espacosDoUsuario);
                }
            } catch (error) {
                console.error('Erro ao carregar espaços:', error);
                // Aqui você pode adicionar um Alert para mostrar o erro ao usuário
            } finally {
                setIsLoading(false);
            }
        };

        carregarEspacos();
    }, [user?.id]);

    const renderItem = ({ item }: { item: Espaco }) => (
        <TouchableOpacity
            style={[styles.espacoCard, { backgroundColor: theme.background }]}
            onPress={() => setEspacoSelecionado(item)}
        >
            <Text style={[styles.espacoNome, { color: theme.text }]}>{item.space_name}</Text>
            <Text style={styles.cardLabel}><Text style={styles.cardLabelBold}>Capacidade: </Text><Text style={styles.cardValue}>{item.max_people} pessoas</Text></Text>
            <Text style={styles.cardLabel}><Text style={styles.cardLabelBold}>Preço: </Text><Text style={styles.cardValue}>R$ {item.price_per_hour?.toFixed(2) ?? '0,00'} / hora</Text></Text>
            <Text style={styles.cardLabel}><Text style={styles.cardLabelBold}>Localização: </Text><Text style={styles.cardValue}>{item.location?.formatted_address}</Text></Text>
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.blue} />
                <Text style={[styles.loadingText, { color: theme.text }]}>Carregando espaços...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.blue }]}>
            <Text style={styles.title}>Dashboard do Locador</Text>
            
            {espacos.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: theme.text }]}>
                        Você ainda não possui espaços cadastrados.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={espacos}
                    renderItem={renderItem}
                    keyExtractor={item => item._id.toString()}
                    contentContainerStyle={styles.lista}
                />
            )}

            <Modal
                visible={espacoSelecionado !== null}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setEspacoSelecionado(null)}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
                        <ScrollView>
                            {espacoSelecionado && (
                                <>
                                    <Text style={[styles.modalTitle, { color: theme.text }]}> 
                                        {espacoSelecionado.space_name}
                                    </Text>
                                    <View style={styles.detalheItemCol}>
                                        <Text style={[styles.detalheLabel, { color: theme.text }]}>Capacidade:</Text>
                                        <Text style={[styles.detalheValor, { color: theme.text }]}>{espacoSelecionado.max_people} pessoas</Text>
                                    </View>
                                    <View style={styles.detalheItemCol}>
                                        <Text style={[styles.detalheLabel, { color: theme.text }]}>Preço:</Text>
                                        <Text style={[styles.detalheValor, { color: theme.text }]}>R$ {espacoSelecionado.price_per_hour?.toFixed(2) ?? '0,00'} / hora</Text>
                                    </View>
                                    <View style={styles.detalheItemCol}>
                                        <Text style={[styles.detalheLabel, { color: theme.text }]}>Localização:</Text>
                                        <Text style={[styles.detalheValor, { color: theme.text }]}>{espacoSelecionado.location?.formatted_address ?? 'Não informado'}</Text>
                                    </View>
                                    <View style={styles.detalheItemCol}>
                                        <Text style={[styles.detalheLabel, { color: theme.text }]}>Descrição:</Text>
                                        <Text style={[styles.detalheValor, { color: theme.text }]}>{espacoSelecionado.space_description ?? 'Sem descrição'}</Text>
                                    </View>
                                    <View style={styles.detalheItemCol}>
                                        <Text style={[styles.detalheLabel, { color: theme.text }]}>Datas já alugadas:</Text>
                                        {loadingDatasAlugadas ? (
                                            <Text style={[styles.detalheValor, { color: theme.text }]}>Carregando...</Text>
                                        ) : datasAlugadas.length === 0 ? (
                                            <Text style={[styles.detalheValor, { color: theme.text }]}>Nenhuma data alugada</Text>
                                        ) : (
                                            datasAlugadas.map((d) => (
                                                <Text key={d.date} style={[styles.detalheValor, { color: theme.text }]}> 
                                                    {new Date(d.date).toLocaleDateString('pt-BR')} {d.times.length > 0 ? `(${d.times.map(t => t.startTime + ' - ' + t.endTime).join(', ')})` : ''}
                                                </Text>
                                            ))
                                        )}
                                    </View>
                                </>
                            )}
                        </ScrollView>
                        <TouchableOpacity
                            style={[styles.fecharButton, { backgroundColor: theme.blue }]}
                            onPress={() => setEspacoSelecionado(null)}
                        >
                            <Text style={styles.fecharButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 32,
        marginTop: 40,
        textAlign: 'center',
        color: '#fff',
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 4,
    },
    lista: {
        paddingBottom: 20,
    },
    espacoCard: {
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    espacoNome: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    cardLabel: {
        fontSize: 16,
        marginBottom: 2,
    },
    cardLabelBold: {
        fontWeight: 'bold',
        fontSize: 17,
    },
    cardValue: {
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        maxHeight: '80%',
        borderRadius: 15,
        padding: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    detalheItemCol: {
        marginBottom: 16,
    },
    detalheLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    detalheValor: {
        fontSize: 16,
    },
    fecharButton: {
        marginTop: 20,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    fecharButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 