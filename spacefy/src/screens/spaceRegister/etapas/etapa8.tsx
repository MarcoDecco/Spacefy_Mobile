import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TouchableWithoutFeedback, SafeAreaView, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useSpaceRegister } from '../../../contexts/SpaceRegisterContext';
import { styles } from '../../../styles/spaceRegisterStyles/etapa8Styles';
import { ProgressBar } from '../../../components/ProgressBar';
import { colors } from '../../../styles/globalStyles/colors';
import { Ionicons } from '@expo/vector-icons';
import api from '../../../services/api';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../../navigation/types';
import { NavigationButtons } from '../../../components/buttons/NavigationButtons';
import { Keyboard } from 'react-native';

const MAPEAMENTO_REGRAS = {
  'nao_fumar': 'Não é permitido fumar',
  'nao_animais': 'Não é permitido animais',
  'nao_festas': 'Não é permitido festas',
  'nao_barulho': 'Não é permitido barulho após 22h',
  'reserva_antecipada': 'É necessário reserva antecipada',
  'deposito': 'É necessário depósito de segurança',
  'contrato': 'É necessário contrato',
  'seguro': 'É necessário seguro',
};

const MAPEAMENTO_DIAS = {
  'mon': 'Segunda-feira',
  'tue': 'Terça-feira',
  'wed': 'Quarta-feira',
  'thu': 'Quinta-feira',
  'fri': 'Sexta-feira',
  'sat': 'Sábado',
  'sun': 'Domingo',
};

// Componente para seções de revisão
const RevisaoSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.secaoContainer}>
    <Text style={styles.secaoTitulo}>{title}</Text>
    <View style={styles.secaoConteudo}>{children}</View>
  </View>
);

// Componente para itens de revisão
const ItemRevisao = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.itemContainer}>
    <Text style={styles.itemLabel}>{label}</Text>
    <Text style={styles.itemValue}>{value}</Text>
  </View>
);

// Componente para itens de revisão com texto longo
const ItemRevisaoLargo = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.itemContainerLargo}>
    <Text style={styles.itemLabel}>{label}</Text>
    <Text style={styles.itemValue}>{value}</Text>
  </View>
);

const Etapa8 = () => {
  const navigation = useNavigation<NavigationProps>();
  const { formData, resetFormData } = useSpaceRegister();
  const [loading, setLoading] = useState(false);
  const [termoAceito, setTermoAceito] = useState(false);

  // Função para validar os campos da etapa
  const validarEtapa = () => {
    const erros = [];
    
    if (!termoAceito) {
      erros.push('Você precisa aceitar os termos de uso para finalizar o cadastro');
    }

    // Validar campos obrigatórios
    const camposObrigatorios = [
      { campo: 'space_name', label: 'Nome do Espaço' },
      { campo: 'space_type', label: 'Tipo do Espaço' },
      { campo: 'max_people', label: 'Capacidade' },
      { campo: 'street', label: 'Rua' },
      { campo: 'number', label: 'Número' },
      { campo: 'neighborhood', label: 'Bairro' },
      { campo: 'city', label: 'Cidade' },
      { campo: 'state', label: 'Estado' },
      { campo: 'zipCode', label: 'CEP' },
      { campo: 'weekly_days', label: 'Dias da Semana' },
      { campo: 'price_per_hour', label: 'Preço por Hora' },
      { campo: 'space_rules', label: 'Regras do Espaço' },
      { campo: 'space_amenities', label: 'Comodidades' },
      { campo: 'owner_name', label: 'Nome do Proprietário' },
      { campo: 'owner_email', label: 'Email do Proprietário' },
      { campo: 'owner_phone', label: 'Telefone do Proprietário' },
      { campo: 'document_number', label: 'CPF/CNPJ do Proprietário' }
    ];

    camposObrigatorios.forEach(({ campo, label }) => {
      const valor = formData[campo as keyof typeof formData];
      if (!valor || (Array.isArray(valor) && valor.length === 0)) {
        erros.push(`${label} é obrigatório`);
      }
    });

    return {
      valido: erros.length === 0,
      erros
    };
  };

  const handleFinalizar = async () => {
    const validacao = validarEtapa();
    if (!validacao.valido) {
      Alert.alert('Erro', validacao.erros.join('\n'));
      return;
    }

    setLoading(true);
    try {
      // Aqui você implementaria a lógica para enviar os dados para a API
      await api.post('/spaces', formData);
      Alert.alert('Sucesso', 'Espaço cadastrado com sucesso!');
      resetFormData();
      // Navegar para a tela inicial ou outra tela apropriada
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cadastrar o espaço. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.progressContainer}>
          <ProgressBar progress={1} currentStep={8} totalSteps={8} />
        </View>

        <ScrollView 
          style={styles.formContainer} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <Text style={styles.title}>Revisar e Confirmar</Text>
          <Text style={styles.subtitle}>
            Revise todas as informações antes de finalizar o cadastro do seu espaço
          </Text>

          <RevisaoSection title="Informações Básicas">
            <ItemRevisao label="Nome do Espaço" value={formData.space_name} />
            <ItemRevisao label="Tipo do Espaço" value={formData.space_type} />
            <ItemRevisao label="Capacidade" value={formData.max_people} />
            <ItemRevisaoLargo label="Descrição" value={formData.space_description} />
          </RevisaoSection>

          <RevisaoSection title="Endereço">
            <ItemRevisao label="Rua" value={formData.street} />
            <ItemRevisao label="Número" value={formData.number} />
            {formData.complement && (
              <ItemRevisao label="Complemento" value={formData.complement} />
            )}
            <ItemRevisao label="Bairro" value={formData.neighborhood} />
            <ItemRevisao label="Cidade" value={formData.city} />
            <ItemRevisao label="Estado" value={formData.state} />
            <ItemRevisao label="CEP" value={formData.zipCode} />
          </RevisaoSection>

          <RevisaoSection title="Disponibilidade">
            {formData.weekly_days && formData.weekly_days.length > 0 ? (
              formData.weekly_days.map((day, index) => (
                <View key={index} style={styles.itemContainer}>
                  <Text style={styles.itemLabel}>{MAPEAMENTO_DIAS[day.day as keyof typeof MAPEAMENTO_DIAS]}</Text>
                  <View style={{ flex: 1 }}>
                    {day.time_ranges.map((range, rangeIndex) => (
                      <Text key={rangeIndex} style={styles.itemValue}>
                        {range.open} - {range.close}
                      </Text>
                    ))}
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noAmenitiesText}>Nenhum horário informado</Text>
            )}
          </RevisaoSection>

          <RevisaoSection title="Preços">
            <ItemRevisao 
              label="Preço por Hora" 
              value={`R$ ${Number(formData.price_per_hour).toFixed(2).replace('.', ',')}`} 
            />
          </RevisaoSection>

          <RevisaoSection title="Regras">
            {formData.space_rules.length > 0 ? (
              formData.space_rules.map((regra, index) => (
                <View key={index} style={styles.itemContainer}>
                  <Text style={styles.itemValue}>• {MAPEAMENTO_REGRAS[regra as keyof typeof MAPEAMENTO_REGRAS] || regra}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noAmenitiesText}>Nenhuma regra informada</Text>
            )}
          </RevisaoSection>

          <RevisaoSection title="Comodidades">
            <View style={styles.amenitiesContainer}>
              {formData.space_amenities.length > 0 ? (
                formData.space_amenities.map((comodidade, index) => (
                  <View key={index} style={styles.amenityItem}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.blue} />
                    <Text style={styles.amenityText}>{comodidade}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noAmenitiesText}>Nenhuma comodidade informada</Text>
              )}
            </View>
          </RevisaoSection>

          <RevisaoSection title="Informações do Proprietário">
            <ItemRevisao label="Nome" value={formData.owner_name} />
            <ItemRevisao label="Email" value={formData.owner_email} />
            <ItemRevisao label="Telefone" value={formData.owner_phone} />
            <ItemRevisao label="CPF/CNPJ" value={formData.document_number} />
          </RevisaoSection>

          <View style={styles.termoContainer}>
            <TouchableOpacity
              style={[styles.checkbox, termoAceito && styles.checkboxChecked]}
              onPress={() => setTermoAceito(!termoAceito)}
            >
              {termoAceito && <Ionicons name="checkmark" size={16} color={colors.white} />}
            </TouchableOpacity>
            <Text style={styles.termoText}>
              Li e aceito os{' '}
              <Text style={styles.termoLink} onPress={() => {}}>
                termos de uso
              </Text>
              {' '}e{' '}
              <Text style={styles.termoLink} onPress={() => {}}>
                política de privacidade
              </Text>
            </Text>
          </View>
        </ScrollView>

        <View style={styles.navigationContainer}>
          <NavigationButtons
            onBack={() => navigation.goBack()}
            onNext={handleFinalizar}
            disabled={!termoAceito || loading}
            nextText="Finalizar"
          />
        </View>

        {loading && (
          <View style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(255,255,255,0.7)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
          }}>
            <ActivityIndicator size="large" color={colors.blue} />
          </View>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Etapa8; 