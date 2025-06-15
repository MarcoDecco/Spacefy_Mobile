import { useState } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { inputStyles } from '../../styles/componentStyles/inputStyles';
import { pageTexts } from '../../styles/globalStyles/pageTexts';
import { styles } from '../../styles/spaceRegisterStyles/SpaceInfoScreenStyles';
import RegisterSpaceInput from '../../components/inputs/registerSpaceInput';
import RegisterSpaceButton from '../../components/buttons/registerSpaceButton';

export default function SpaceInfoScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Etapa 1 de 6</Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: '16%' }]} />
          <View style={styles.progressBarInactive} />
          <View style={styles.progressBarInactive} />
          <View style={styles.progressBarInactive} />
          <View style={styles.progressBarInactive} />
          <View style={styles.progressBarInactive} />
        </View>
      </View>
      <Text style={styles.title}>Informações do Espaço</Text>
      <View style={{ paddingBottom: 80 }}>
        <RegisterSpaceInput
          label="Nome do espaço"
          placeholder="Insira o nome do espaço"
          value={name}
          onChangeText={setName}
        />
        <RegisterSpaceInput
          label="Capacidade máxima de pessoas"
          placeholder="Insira o número máximo de pessoas"
          value={capacity}
          onChangeText={setCapacity}
          keyboardType="numeric"
        />
        <RegisterSpaceInput
          label="Localização"
          placeholder="Insira a URL do Google Maps"
          value={location}
          onChangeText={setLocation}
          hint="URL do MAPS"
        />
        <Text style={pageTexts.labelInput}>Tipo de espaço</Text>
        <TouchableOpacity style={styles.typeButton}>
          <Text style={styles.typeButtonText}>Escolher tipo</Text>
        </TouchableOpacity>
        <RegisterSpaceInput
          label="Breve descrição do espaço"
          placeholder="Descreva como é o seu espaço"
          value={description}
          onChangeText={setDescription}
          multiline
          maxLength={250}
          hint="MAX 250 caracteres"
        />
      </View>
      <View style={styles.buttonRowFixed}>
        <RegisterSpaceButton
          title="Voltar"
          onPress={() => navigation.goBack()}
          variant="secondary"
        />
        <RegisterSpaceButton
          title="Prosseguir"
          onPress={() => navigation.navigate('SpaceNextStepScreen' as never)}
        />
      </View>
    </SafeAreaView>
  );
} 