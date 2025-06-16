import React, { useState, useEffect } from 'react';
import { 
  View, 
  SafeAreaView, 
  Text, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  Keyboard, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../../navigation/types';
import { styles } from '../../../styles/spaceRegisterStyles/etapa2Styles';
import { colors } from '../../../styles/globalStyles/colors';
import RegisterSpaceInput from '../../../components/inputs/registerSpaceInput';
import RegisterSpaceButton from '../../../components/buttons/registerSpaceButton';
import { ProgressBar } from '../../../components/ProgressBar';
import { useSpaceRegister } from '../../../contexts/SpaceRegisterContext';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { NavigationButtons } from '../../../components/buttons/NavigationButtons';
import { useTheme } from '../../../contexts/ThemeContext';

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

interface LocationData {
  latitude: number;
  longitude: number;
}

const estados = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
];

const Etapa2 = () => {
  const navigation = useNavigation<NavigationProps>();
  const { formData, updateFormData } = useSpaceRegister();
  const { isDarkMode, theme } = useTheme();
  const [street, setStreet] = useState(formData.street || '');
  const [number, setNumber] = useState(formData.number || '');
  const [complement, setComplement] = useState(formData.complement || '');
  const [neighborhood, setNeighborhood] = useState(formData.neighborhood || '');
  const [city, setCity] = useState(formData.city || '');
  const [state, setState] = useState(formData.state || '');
  const [zipCode, setZipCode] = useState(formData.zipCode || '');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [mapLoading, setMapLoading] = useState(true);

  const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
    try {
      // Primeiro, vamos buscar o CEP usando a API do ViaCEP
      const response = await fetch(
        `https://viacep.com.br/ws/${zipCode}/json/`
      );
      const data: ViaCepResponse = await response.json();

      if (data.erro) {
        Alert.alert('Erro', 'Não foi possível obter o endereço');
        return;
      }

      // Preencher os campos com os dados do endereço
      setStreet(data.logradouro);
      setNeighborhood(data.bairro);
      setCity(data.localidade);
      setState(data.uf);
      
      if (data.complemento) {
        setComplement(data.complemento);
      }
    } catch (error) {
      console.error('Erro ao obter endereço:', error);
      Alert.alert('Erro', 'Não foi possível obter o endereço');
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permissão negada',
            'Precisamos da sua localização para mostrar o mapa',
            [{ text: 'OK' }]
          );
          setMapLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const newLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        setLocation(newLocation);

        // Buscar o CEP mais próximo usando a API do ViaCEP
        const cepResponse = await fetch(
          `https://viacep.com.br/ws/${zipCode}/json/`
        );
        const cepData = await cepResponse.json();

        if (!cepData.erro) {
          setZipCode(cepData.cep);
          await getAddressFromCoordinates(newLocation.latitude, newLocation.longitude);
        }
      } catch (error) {
        Alert.alert(
          'Erro',
          'Não foi possível obter sua localização',
          [{ text: 'OK' }]
        );
      } finally {
        setMapLoading(false);
      }
    })();
  }, []);

  const fetchAddressByCep = async (cep: string) => {
    try {
      setLoading(true);
      const cleanCep = cep.replace(/\D/g, '');
      
      if (cleanCep.length !== 8) {
        return;
      }

      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data: ViaCepResponse = await response.json();

      if (data.erro) {
        Alert.alert('Erro', 'CEP não encontrado');
        return;
      }

      setStreet(data.logradouro);
      setNeighborhood(data.bairro);
      setCity(data.localidade);
      setState(data.uf);
      
      if (data.complemento) {
        setComplement(data.complemento);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível buscar o endereço');
    } finally {
      setLoading(false);
    }
  };

  const handleZipCodeChange = (text: string) => {
    const cleanText = text.replace(/\D/g, '');
    const formattedText = cleanText.replace(/^(\d{5})(\d)/, '$1-$2');
    setZipCode(formattedText);

    if (cleanText.length === 8) {
      fetchAddressByCep(cleanText);
    }
  };

  const handleProsseguir = () => {
    if (!street || !number || !neighborhood || !city || !state || !zipCode) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    updateFormData({
      ...formData,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      zipCode,
      latitude: location?.latitude,
      longitude: location?.longitude,
    });

    // @ts-ignore
    navigation.navigate('Etapa3');
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <View style={[styles.progressContainer, isDarkMode && { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <ProgressBar progress={0.25} currentStep={2} totalSteps={8} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <View style={styles.header}>
                <Text style={[styles.title, isDarkMode && { color: theme.text }]}>Localização</Text>
                <Text style={[styles.description, isDarkMode && { color: theme.text }]}>
                  Informe o endereço completo do seu espaço
                </Text>
              </View>

              <View style={styles.formContainer}>
                <View style={[styles.addressContainer, isDarkMode && { backgroundColor: theme.card }]}>
                  <View style={styles.addressRow}>
                    <MaterialIcons name="location-on" size={24} color={colors.blue} style={styles.addressIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.addressLabel, isDarkMode && { color: theme.text }]}>Endereço</Text>
                      <Text style={[styles.addressText, isDarkMode && { color: theme.text }]}>
                        {street ? `${street}, ${number}` : 'Endereço não informado'}
                      </Text>
                    </View>
                    <TouchableOpacity 
                      style={[styles.useCurrentLocationButton, isDarkMode && { backgroundColor: theme.card }]}
                      onPress={async () => {
                        try {
                          setLoading(true);
                          const { status } = await Location.requestForegroundPermissionsAsync();
                          if (status !== 'granted') {
                            Alert.alert('Permissão negada', 'Precisamos da sua localização para preencher o endereço');
                            return;
                          }

                          const location = await Location.getCurrentPositionAsync({
                            accuracy: Location.Accuracy.High,
                          });

                          const newLocation = {
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                          };

                          setLocation(newLocation);

                          // Buscar o endereço usando a API de geocodificação reversa
                          const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLocation.latitude}&lon=${newLocation.longitude}`
                          );
                          const data = await response.json();

                          if (data.address) {
                            setStreet(data.address.road || data.address.pedestrian || '');
                            setNumber(data.address.house_number || '');
                            setNeighborhood(data.address.suburb || data.address.neighbourhood || '');
                            setCity(data.address.city || data.address.town || '');
                            setState(data.address.state || '');
                            setZipCode(data.address.postcode || '');
                          }
                        } catch (error) {
                          Alert.alert('Erro', 'Não foi possível obter seu endereço atual');
                        } finally {
                          setLoading(false);
                        }
                      }}
                    >
                      <MaterialIcons name="my-location" size={24} color={colors.blue} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={[styles.mapContainer, isDarkMode && { backgroundColor: theme.card }]}>
                  {mapLoading ? (
                    <View style={styles.mapLoadingContainer}>
                      <ActivityIndicator size="large" color={colors.blue} />
                    </View>
                  ) : (
                    <>
                      <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        initialRegion={location ? {
                          latitude: location.latitude,
                          longitude: location.longitude,
                          latitudeDelta: 0.005,
                          longitudeDelta: 0.005,
                        } : undefined}
                      >
                        {location && (
                          <Marker
                            coordinate={{
                              latitude: location.latitude,
                              longitude: location.longitude,
                            }}
                          />
                        )}
                      </MapView>
                      <TouchableOpacity 
                        style={styles.currentLocationButton}
                        onPress={async () => {
                          try {
                            setMapLoading(true);
                            const location = await Location.getCurrentPositionAsync({
                              accuracy: Location.Accuracy.High,
                            });
                            const newLocation = {
                              latitude: location.coords.latitude,
                              longitude: location.coords.longitude,
                            };
                            setLocation(newLocation);
                            // Aqui você pode adicionar a lógica para buscar o CEP mais próximo
                            // e preencher o endereço
                          } catch (error) {
                            Alert.alert('Erro', 'Não foi possível obter sua localização');
                          } finally {
                            setMapLoading(false);
                          }
                        }}
                      >
                        <MaterialIcons name="my-location" size={24} color={colors.white} />
                      </TouchableOpacity>
                    </>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <RegisterSpaceInput
                    label="CEP"
                    placeholder="Digite o CEP"
                    value={zipCode}
                    onChangeText={handleZipCodeChange}
                    keyboardType="numeric"
                    maxLength={9}
                    rightIcon={loading ? <ActivityIndicator color={colors.blue} /> : undefined}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <RegisterSpaceInput
                    label="Endereço"
                    placeholder="Digite o endereço"
                    value={street}
                    onChangeText={setStreet}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <RegisterSpaceInput
                    label="Número"
                    placeholder="Digite o número"
                    value={number}
                    onChangeText={setNumber}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <RegisterSpaceInput
                    label="Complemento"
                    placeholder="Digite o complemento (opcional)"
                    value={complement}
                    onChangeText={setComplement}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <RegisterSpaceInput
                    label="Bairro"
                    placeholder="Digite o bairro"
                    value={neighborhood}
                    onChangeText={setNeighborhood}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <RegisterSpaceInput
                    label="Cidade"
                    placeholder="Digite a cidade"
                    value={city}
                    onChangeText={setCity}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <RegisterSpaceInput
                    label="Estado"
                    placeholder="Digite o estado"
                    value={state}
                    onChangeText={setState}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>

        <NavigationButtons
          onBack={() => navigation.goBack()}
          onNext={handleProsseguir}
          disabled={!street || !number || !neighborhood || !city || !state || !zipCode}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Etapa2; 