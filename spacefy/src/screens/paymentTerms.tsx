import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/globalStyles/colors';
import { paymentTermsStyles as styles } from '../styles/paymentTermsStyles';

export default function PaymentTerms() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Termos de Distribuição de Pagamento</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Atenção</Text>
          <Text style={styles.paragraph}>
            Ao se tornar um locador em nossa plataforma, você concorda com os termos abaixo referentes à distribuição dos valores obtidos por meio dos aluguéis realizados.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Percentual de repasse</Text>
          <Text style={styles.paragraph}>
            A cada aluguel concluído por meio da plataforma, 90% (noventa por cento) do valor total pago pelo locatário será repassado ao locador responsável pelo espaço alugado.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Taxa de serviço da plataforma</Text>
          <Text style={styles.paragraph}>
            Os 10% (dez por cento) restantes do valor da transação são destinados à plataforma e têm como finalidade cobrir os seguintes custos operacionais:
          </Text>

          <View style={styles.listItem}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.listText}>Manutenção técnica e melhorias contínuas do sistema, garantindo estabilidade, segurança e novas funcionalidades;</Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.listText}>Suporte ao cliente, incluindo atendimento a usuários e resolução de eventuais problemas durante o processo de aluguel;</Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.listText}>Marketing e divulgação, promovendo os espaços cadastrados por meio de campanhas digitais, redes sociais e outros canais de visibilidade para atrair locatários.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Aceite do locador</Text>
          <Text style={styles.paragraph}>
            Ao se cadastrar como Locador em nossa plataforma, o usuário declara estar ciente e de pleno acordo com os percentuais de divisão de valores e as finalidades da taxa de serviço aqui descritas.
          </Text>
        </View>

      </ScrollView>
    </View>
  );
} 