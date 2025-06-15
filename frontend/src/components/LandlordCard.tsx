import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '~/styles/globalStyles/colors';

interface LandlordCardProps {
  name: string;
  avatar?: any;
  reviews: number;
  rating: number;
  spaces: number;
  isDarkMode: boolean;
  theme: any;
  styles: any;
  onPress: () => void;
}

export const LandlordCard: React.FC<LandlordCardProps> = ({
  name,
  avatar = require('../../assets/perfil-login.png'),
  reviews,
  rating,
  spaces,
  isDarkMode,
  theme,
  styles,
  onPress,
}) => (
  <View style={{ alignItems: 'center', marginBottom: 80 }}>
    <Text
      style={[
        styles.sectionTitle,
        { textAlign: 'center' },
        isDarkMode && { color: theme.text },
      ]}>
      Conheça o locador do espaço
    </Text>
    <Text
      style={[
        styles.rentalSubtitle,
        { textAlign: 'center' },
        isDarkMode && { color: theme.text },
      ]}>
      Clique para ver mais
    </Text>
    <TouchableOpacity
      style={[
        styles.rentalCard,
        {
          width: 320,
          alignItems: 'center',
          padding: 24,
        },
        isDarkMode && { backgroundColor: theme.card },
      ]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={{ alignItems: 'center', marginBottom: 8 }}>
        <Image
          source={avatar}
          style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            marginBottom: 8,
            backgroundColor: '#e6f0fa',
          }}
        />
        <Text
          style={[
            styles.rentalTitle,
            { marginBottom: 4 },
            isDarkMode && { color: theme.text },
          ]}>
          {name}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
        }}>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={[styles.rentalTotalValue, isDarkMode && { color: theme.text }]}>
            {reviews}
          </Text>
          <Text style={[styles.rentalSubtitle, isDarkMode && { color: theme.text }]}>
            avaliações
          </Text>
        </View>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={[styles.rentalTotalValue, isDarkMode && { color: theme.text }]}>
              {rating}
            </Text>
            <MaterialIcons
              name="star"
              size={16}
              color={isDarkMode ? theme.text : colors.gray}
              style={{ marginLeft: 2 }}
            />
          </View>
          <Text style={[styles.rentalSubtitle, isDarkMode && { color: theme.text }]}>
            estrelas
          </Text>
        </View>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={[styles.rentalTotalValue, isDarkMode && { color: theme.text }]}>
            {spaces}
          </Text>
          <Text style={[styles.rentalSubtitle, isDarkMode && { color: theme.text }]}>
            espaços
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  </View>
);