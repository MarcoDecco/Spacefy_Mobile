import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TouchableWithoutFeedback, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useSpaceRegister } from '../../../contexts/SpaceRegisterContext';
import { styles } from '../../../styles/spaceRegisterStyles/etapa8Styles';
import { ProgressBar } from '../../../components/ProgressBar';
import { colors } from '../../../styles/globalStyles/colors';
import { Ionicons } from '@expo/vector-icons';
import api from '../../../services/api';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../../navigation/types';

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
      { campo: 'document_photo', label: 'Documento do Proprietário' },
      { campo: 'space_document_photo', label: 'Documento do Espaço' }
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
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <ProgressBar progress={1} currentStep={8} totalSteps={8} />
      </View>

      <Text style={styles.title}>Revisar e Confirmar</Text>
      <Text style={styles.subtitle}>
        Revise todas as informações antes de finalizar o cadastro do seu espaço
      </Text>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 120 }}
        style={{ flex: 1 }}
      >
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
          {formData.weekly_days.map((day, index) => (
            <View key={index} style={styles.itemContainer}>
              <Text style={styles.itemLabel}>{day.day}</Text>
              {day.time_ranges.map((range, rangeIndex) => (
                <Text key={rangeIndex} style={styles.itemValue}>
                  {range.open} - {range.close}
                </Text>
              ))}
            </View>
          ))}
        </RevisaoSection>

        <RevisaoSection title="Preços">
          <ItemRevisao label="Preço por Hora" value={formData.price_per_hour} />
        </RevisaoSection>

        <RevisaoSection title="Regras">
          {formData.space_rules.length > 0 ? (
            formData.space_rules.map((regra, index) => (
              <View key={index} style={styles.itemContainer}>
                <Text style={styles.itemValue}>• {regra}</Text>
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

        <RevisaoSection title="Documentos">
          <ItemRevisao 
            label="Documento do Proprietário" 
            value={formData.document_photo ? 'Documento anexado' : 'Não anexado'} 
          />
          <ItemRevisao 
            label="Documento do Espaço" 
            value={formData.space_document_photo ? 'Documento anexado' : 'Não anexado'} 
          />
        </RevisaoSection>

        <RevisaoSection title="Termo de Uso">
          <View style={styles.termoContainer}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setTermoAceito(!termoAceito)}
            >
              <View style={[styles.checkbox, termoAceito && styles.checkboxChecked]}>
                {termoAceito && <Ionicons name="checkmark" size={16} color={colors.white} />}
              </View>
              <View>
                <Text style={styles.checkboxLabel}>Aceito os termos de uso</Text>
                <Text style={styles.checkboxDescription}>
                  Ao marcar esta opção, você concorda com os termos de uso e política de privacidade do Spacefy.
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </RevisaoSection>
      </ScrollView>

      <View style={styles.buttonRowFixed}>
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonTextSecondary}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary, loading && styles.buttonDisabled]}
          onPress={handleFinalizar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonTextPrimary}>Finalizar Cadastro</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Etapa8; 